const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const promisifiedJWTVerify = promisify(jwt.verify);
const UserModel = require("./models/UserModel");
const RoomModel = require("./models/RoomModel");

let io = null;

// Helper to parse cookies from handshake headers
const parseCookies = (cookieString) => {
    if (!cookieString) return {};
    return cookieString.split(';').reduce((acc, pair) => {
        const [key, val] = pair.split('=').map(c => c.trim());
        if (key && val) {
            acc[key] = decodeURIComponent(val);
        }
        return acc;
    }, {});
};

// In-memory active rooms tracking for online participants and rapid playback sync
// Structure:
// {
//     [roomId]: {
//         hostId: String,
//         playbackState: { isPlaying: Boolean, currentTime: Number, lastUpdated: Date },
//         participants: {
//             [socketId]: { userId: String, name: String }
//         }
//     }
// }
const activeRooms = {};

// Socket.IO authentication middleware
const socketAuth = async (socket, next) => {
    try {
        let token = null;

        // 1. Try cookie parsing
        const cookieHeader = socket.handshake.headers.cookie;
        if (cookieHeader) {
            const cookies = parseCookies(cookieHeader);
            token = cookies.jwt;
        }

        // 2. Fallback to handshake auth payload (useful for API test clients)
        if (!token && socket.handshake.auth) {
            token = socket.handshake.auth.token;
        }

        if (!token) {
            return next(new Error("Authentication error: Token not found"));
        }

        const decoded = await promisifiedJWTVerify(token, process.env.JWT_SECRET_KEY);
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            return next(new Error("Authentication error: User not found"));
        }

        // Attach user to socket connection
        socket.user = user;
        next();
    } catch (err) {
        return next(new Error("Authentication error: Invalid session"));
    }
};

const init = (server) => {
    io = new Server(server, {
        cors: {
            origin: [
                process.env.FRONTEND_URL,
                "http://localhost:3000"
            ],
            credentials: true
        }
    });

    // Enforce authentication on all incoming connections
    io.use(socketAuth);

    io.on("connection", (socket) => {
        let currentRoomId = null;

        // Keep track of rate limit timestamps
        socket.messageTimestamps = [];

        // 1. Joining a room
        socket.on("room:join", async ({ roomId }) => {
            try {
                if (!roomId) {
                    return socket.emit("room:error", { message: "Room ID is required" });
                }

                // Retrieve room from DB
                const room = await RoomModel.findOne({ roomId });
                if (!room) {
                    return socket.emit("room:error", { message: "Room not found" });
                }

                // Join Socket.IO channel
                socket.join(roomId);
                currentRoomId = roomId;

                // Initialize in-memory active room structure if missing
                if (!activeRooms[roomId]) {
                    activeRooms[roomId] = {
                        hostId: room.host.toString(),
                        playbackState: {
                            isPlaying: room.playbackState.isPlaying,
                            currentTime: room.playbackState.currentTime,
                            lastUpdated: room.playbackState.lastUpdated || new Date()
                        },
                        participants: {}
                    };
                }

                // Add user to active roster
                activeRooms[roomId].participants[socket.id] = {
                    userId: socket.user._id.toString(),
                    name: socket.user.name
                };

                // Retrieve active participants count and details
                const participantsList = Object.values(activeRooms[roomId].participants);

                // Send setup details back to the joining user
                socket.emit("room:state", {
                    roomId,
                    movieId: room.movieId,
                    mediaType: room.mediaType,
                    movieName: room.movieName,
                    posterPath: room.posterPath,
                    description: room.description,
                    hostId: activeRooms[roomId].hostId,
                    playbackState: activeRooms[roomId].playbackState,
                    participants: participantsList,
                    messages: room.messages.slice(-50) // Return last 50 messages for history
                });

                // Broadcast to others that a user has joined
                socket.to(roomId).emit("user:joined", {
                    userId: socket.user._id.toString(),
                    userName: socket.user.name,
                    participants: participantsList
                });

                console.log(`User ${socket.user.name} joined room ${roomId}`);
            } catch (err) {
                console.error("Error joining room:", err);
                socket.emit("room:error", { message: "Failed to join room" });
            }
        });

        // Helper check: Is this socket the host of their active room?
        const isHost = () => {
            if (!currentRoomId || !activeRooms[currentRoomId]) return false;
            return activeRooms[currentRoomId].hostId === socket.user._id.toString();
        };

        // 2. Playback: Play
        socket.on("movie:play", async ({ time }) => {
            try {
                if (!isHost()) {
                    return socket.emit("playback:error", { message: "Only the host can control playback" });
                }

                const updatedState = {
                    isPlaying: true,
                    currentTime: time,
                    lastUpdated: new Date()
                };

                // Save state in memory and database
                activeRooms[currentRoomId].playbackState = updatedState;
                await RoomModel.updateOne({ roomId: currentRoomId }, { $set: { playbackState: updatedState } });

                // Broadcast control event
                socket.to(currentRoomId).emit("movie:play", { time });
            } catch (err) {
                console.error("Playback error (play):", err);
            }
        });

        // 3. Playback: Pause
        socket.on("movie:pause", async ({ time }) => {
            try {
                if (!isHost()) {
                    return socket.emit("playback:error", { message: "Only the host can control playback" });
                }

                const updatedState = {
                    isPlaying: false,
                    currentTime: time,
                    lastUpdated: new Date()
                };

                activeRooms[currentRoomId].playbackState = updatedState;
                await RoomModel.updateOne({ roomId: currentRoomId }, { $set: { playbackState: updatedState } });

                socket.to(currentRoomId).emit("movie:pause", { time });
            } catch (err) {
                console.error("Playback error (pause):", err);
            }
        });

        // 4. Playback: Seek
        socket.on("movie:seek", async ({ time }) => {
            try {
                if (!isHost()) {
                    return socket.emit("playback:error", { message: "Only the host can control playback" });
                }

                const updatedState = {
                    isPlaying: activeRooms[currentRoomId].playbackState.isPlaying,
                    currentTime: time,
                    lastUpdated: new Date()
                };

                activeRooms[currentRoomId].playbackState = updatedState;
                await RoomModel.updateOne({ roomId: currentRoomId }, { $set: { playbackState: updatedState } });

                socket.to(currentRoomId).emit("movie:seek", { time });
            } catch (err) {
                console.error("Playback error (seek):", err);
            }
        });

        // 5. Playback: Periodic synchronization
        socket.on("movie:sync", async ({ time, isPlaying }) => {
            try {
                if (!isHost()) return;

                const updatedState = {
                    isPlaying,
                    currentTime: time,
                    lastUpdated: new Date()
                };

                activeRooms[currentRoomId].playbackState = updatedState;
                // Throttled Mongoose saves can be done, but for simplicity, update DB on periodic syncs as well
                await RoomModel.updateOne({ roomId: currentRoomId }, { $set: { playbackState: updatedState } });

                socket.to(currentRoomId).emit("movie:sync", { time, isPlaying });
            } catch (err) {
                console.error("Playback error (sync):", err);
            }
        });

        // 6. Live Chat: Message
        socket.on("chat:send", async ({ message }) => {
            try {
                if (!currentRoomId || !activeRooms[currentRoomId]) {
                    return socket.emit("chat:error", { message: "You are not in an active room" });
                }

                // Server-side Validations
                if (!message || typeof message !== "string" || message.trim() === "") {
                    return socket.emit("chat:error", { message: "Message cannot be empty" });
                }

                if (message.length > 1000) {
                    return socket.emit("chat:error", { message: "Message exceeds maximum length of 1000 characters" });
                }

                // Basic Chat Rate Limiting (max 5 messages in 5 seconds)
                const now = Date.now();
                socket.messageTimestamps = socket.messageTimestamps.filter(t => now - t < 5000);
                if (socket.messageTimestamps.length >= 5) {
                    return socket.emit("chat:error", { message: "You are sending messages too quickly. Please wait." });
                }
                socket.messageTimestamps.push(now);

                const chatMessage = {
                    sender: socket.user._id,
                    senderName: socket.user.name,
                    message: message.trim(),
                    timestamp: new Date()
                };

                // Persist to MongoDB
                await RoomModel.updateOne(
                    { roomId: currentRoomId },
                    { $push: { messages: chatMessage } }
                );

                // Broadcast to room (including sender, to ensure chronological uniformity)
                io.to(currentRoomId).emit("chat:message", chatMessage);
            } catch (err) {
                console.error("Chat message error:", err);
                socket.emit("chat:error", { message: "Failed to send message" });
            }
        });

        // 7. End room (host only)
        socket.on("room:end", async () => {
            try {
                if (!isHost()) {
                    return socket.emit("room:error", { message: "Only the host can end the room" });
                }

                // Broadcast to all participants before cleaning up
                io.to(currentRoomId).emit("room:ended", {
                    message: "The host has ended the watch party."
                });

                // Delete from MongoDB
                await RoomModel.deleteOne({ roomId: currentRoomId });

                // Remove all sockets from the Socket.IO room
                const sockets = await io.in(currentRoomId).fetchSockets();
                for (const s of sockets) {
                    s.leave(currentRoomId);
                }

                // Clean up in-memory record
                delete activeRooms[currentRoomId];

                console.log(`Room ${currentRoomId} ended by host ${socket.user.name}`);
            } catch (err) {
                console.error("Error ending room:", err);
                socket.emit("room:error", { message: "Failed to end the room" });
            }
        });

        // 8. Disconnection

        socket.on("disconnect", () => {
            if (currentRoomId && activeRooms[currentRoomId]) {
                const roomInfo = activeRooms[currentRoomId];
                
                // Remove participant from roster
                delete roomInfo.participants[socket.id];
                
                const participantsList = Object.values(roomInfo.participants);

                // Broadcast exit to remaining room participants
                socket.to(currentRoomId).emit("user:left", {
                    userId: socket.user._id.toString(),
                    userName: socket.user.name,
                    participants: participantsList
                });

                // Clear memory if room is completely empty
                if (participantsList.length === 0) {
                    delete activeRooms[currentRoomId];
                }
                
                console.log(`User ${socket.user.name} disconnected from room ${currentRoomId}`);
            }
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};

module.exports = {
    init,
    getIO
};
