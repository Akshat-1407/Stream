const http = require("http");
const express = require("express");
const Client = require("socket.io-client");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Set environment variables for tests
process.env.JWT_SECRET_KEY = "test_secret_key";
process.env.NODE_ENV = "test";

// Mock Database Models
const UserModel = require("../models/UserModel");
const RoomModel = require("../models/RoomModel");

jest.mock("../models/UserModel");
jest.mock("../models/RoomModel");

const { init } = require("../socket");

describe("Socket.IO Real-time Watch Room Backend Tests", () => {
    let server;
    let ioServer;
    let port;

    const mockHostUser = {
        _id: new mongoose.Types.ObjectId("60b9f939e6a9cf19a0f05561"),
        name: "Alice",
        email: "alice@example.com"
    };

    const mockVisitorUser = {
        _id: new mongoose.Types.ObjectId("60b9f939e6a9cf19a0f05562"),
        name: "Bob",
        email: "bob@example.com"
    };

    const mockVisitor2User = {
        _id: new mongoose.Types.ObjectId("60b9f939e6a9cf19a0f05563"),
        name: "Charlie",
        email: "charlie@example.com"
    };

    const mockRoomDetails = {
        roomId: "test-room-id-123",
        movieId: "premium-movie-id-1",
        mediaType: "premium",
        movieName: "Awesome Premium Movie",
        posterPath: "/poster.png",
        description: "A very cool video",
        host: mockHostUser._id,
        playbackState: {
            isPlaying: false,
            currentTime: 0,
            lastUpdated: new Date()
        },
        messages: []
    };

    // Helper to generate JWT Token
    const generateToken = (userId) => {
        return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY);
    };

    beforeAll((done) => {
        const app = express();
        server = http.createServer(app);
        ioServer = init(server);

        server.listen(() => {
            port = server.address().port;
            done();
        });
    });

    afterAll(() => {
        ioServer.close();
        server.close();
    });

    beforeEach(() => {
        jest.clearAllMocks();

        // Mocks for database calls
        UserModel.findById.mockImplementation((id) => {
            if (id.toString() === mockHostUser._id.toString()) return Promise.resolve(mockHostUser);
            if (id.toString() === mockVisitorUser._id.toString()) return Promise.resolve(mockVisitorUser);
            if (id.toString() === mockVisitor2User._id.toString()) return Promise.resolve(mockVisitor2User);
            return Promise.resolve(null);
        });

        RoomModel.findOne.mockImplementation(({ roomId }) => {
            if (roomId === mockRoomDetails.roomId) {
                return Promise.resolve(mockRoomDetails);
            }
            if (roomId === "room-2") {
                return Promise.resolve({
                    ...mockRoomDetails,
                    roomId: "room-2",
                    host: mockVisitor2User._id
                });
            }
            return Promise.resolve(null);
        });

        RoomModel.updateOne.mockResolvedValue({ acknowledged: true, modifiedCount: 1 });
    });

    test("Should successfully authenticate socket connections and reject invalid ones", (done) => {
        // Connect with valid token
        const hostToken = generateToken(mockHostUser._id);
        const socket = new Client(`http://localhost:${port}`, {
            auth: { token: hostToken }
        });

        socket.on("connect", () => {
            expect(socket.connected).toBe(true);
            socket.disconnect();
            done();
        });
    });

    test("Should reject connection when token is invalid or missing", (done) => {
        const socket = new Client(`http://localhost:${port}`, {
            auth: { token: "invalid-token" }
        });

        socket.on("connect_error", (err) => {
            expect(err.message).toContain("Authentication error");
            socket.disconnect();
            done();
        });
    });

    test("Should allow user to join watch room and receive current state", (done) => {
        const token = generateToken(mockHostUser._id);
        const client = new Client(`http://localhost:${port}`, {
            auth: { token }
        });

        client.on("connect", () => {
            client.emit("room:join", { roomId: mockRoomDetails.roomId });
        });

        client.on("room:state", (state) => {
            expect(state.roomId).toBe(mockRoomDetails.roomId);
            expect(state.movieId).toBe(mockRoomDetails.movieId);
            expect(state.hostId).toBe(mockRoomDetails.host.toString());
            expect(state.participants.length).toBe(1);
            expect(state.participants[0].name).toBe("Alice");
            client.disconnect();
            done();
        });
    });

    test("Should notify other users when a participant joins and leaves the room", (done) => {
        const hostClient = new Client(`http://localhost:${port}`, {
            auth: { token: generateToken(mockHostUser._id) }
        });

        const visitorClient = new Client(`http://localhost:${port}`, {
            auth: { token: generateToken(mockVisitorUser._id) }
        });

        hostClient.on("connect", () => {
            hostClient.emit("room:join", { roomId: mockRoomDetails.roomId });
        });

        hostClient.on("room:state", () => {
            // Once host is in, connect visitor
            visitorClient.connect();
        });

        // Visitor joins
        visitorClient.on("connect", () => {
            visitorClient.emit("room:join", { roomId: mockRoomDetails.roomId });
        });

        // Host hears visitor join
        hostClient.on("user:joined", (data) => {
            expect(data.userName).toBe("Bob");
            expect(data.participants.length).toBe(2);

            // Visitor leaves by disconnecting
            visitorClient.disconnect();
        });

        // Host hears visitor leave
        hostClient.on("user:left", (data) => {
            expect(data.userName).toBe("Bob");
            expect(data.participants.length).toBe(1);
            hostClient.disconnect();
            done();
        });
    });

    test("Should propagate chat messages inside the room", (done) => {
        const hostClient = new Client(`http://localhost:${port}`, {
            auth: { token: generateToken(mockHostUser._id) }
        });

        const visitorClient = new Client(`http://localhost:${port}`, {
            auth: { token: generateToken(mockVisitorUser._id) }
        });

        hostClient.on("connect", () => {
            hostClient.emit("room:join", { roomId: mockRoomDetails.roomId });
        });

        hostClient.on("room:state", () => {
            visitorClient.emit("room:join", { roomId: mockRoomDetails.roomId });
        });

        visitorClient.on("room:state", () => {
            // Send chat message
            visitorClient.emit("chat:send", { message: "Hello Watch Party!" });
        });

        // Verify everyone in the room receives it
        hostClient.on("chat:message", (msg) => {
            expect(msg.message).toBe("Hello Watch Party!");
            expect(msg.senderName).toBe("Bob");
            hostClient.disconnect();
            visitorClient.disconnect();
            done();
        });
    });

    test("Should enforce Room Isolation (messages from room 1 do not leak to room 2)", (done) => {
        const room1Client = new Client(`http://localhost:${port}`, {
            auth: { token: generateToken(mockHostUser._id) }
        });

        const room2Client = new Client(`http://localhost:${port}`, {
            auth: { token: generateToken(mockVisitor2User._id) }
        });

        room1Client.on("connect", () => {
            room1Client.emit("room:join", { roomId: mockRoomDetails.roomId });
        });

        room2Client.on("connect", () => {
            room2Client.emit("room:join", { roomId: "room-2" });
        });

        room2Client.on("room:state", () => {
            // Send chat in room 2
            room2Client.emit("chat:send", { message: "Secret message in Room 2" });
        });

        let receivedInRoom1 = false;
        room1Client.on("chat:message", () => {
            receivedInRoom1 = true;
        });

        // After a small delay, verify Room 1 client did not receive Room 2 messages
        setTimeout(() => {
            expect(receivedInRoom1).toBe(false);
            room1Client.disconnect();
            room2Client.disconnect();
            done();
        }, 300);
    });

    test("Should propagate play/pause/seek controls only from the host, and reject controls from visitors", (done) => {
        const hostClient = new Client(`http://localhost:${port}`, {
            auth: { token: generateToken(mockHostUser._id) }
        });

        const visitorClient = new Client(`http://localhost:${port}`, {
            auth: { token: generateToken(mockVisitorUser._id) }
        });

        hostClient.on("connect", () => {
            hostClient.emit("room:join", { roomId: mockRoomDetails.roomId });
        });

        hostClient.on("room:state", () => {
            visitorClient.emit("room:join", { roomId: mockRoomDetails.roomId });
        });

        visitorClient.on("room:state", () => {
            // Host plays video
            hostClient.emit("movie:play", { time: 42 });
        });

        // Visitor receives play event
        visitorClient.on("movie:play", ({ time }) => {
            expect(time).toBe(42);

            // Visitor (non-host) tries to play at another time
            visitorClient.emit("movie:play", { time: 100 });
        });

        // Visitor receives playback error
        visitorClient.on("playback:error", (err) => {
            expect(err.message).toContain("Only the host can control playback");
            hostClient.disconnect();
            visitorClient.disconnect();
            done();
        });
    });

    test("Should rate limit chat messages if a user sends them too quickly", (done) => {
        const client = new Client(`http://localhost:${port}`, {
            auth: { token: generateToken(mockHostUser._id) }
        });

        client.on("connect", () => {
            client.emit("room:join", { roomId: mockRoomDetails.roomId });
        });

        client.on("room:state", () => {
            // Send 6 messages immediately
            for (let i = 0; i < 6; i++) {
                client.emit("chat:send", { message: `Spam #${i}` });
            }
        });

        client.on("chat:error", (err) => {
            expect(err.message).toContain("sending messages too quickly");
            client.disconnect();
            done();
        });
    });
});
