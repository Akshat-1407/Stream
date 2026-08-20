import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { API_BASE_URL } from "@/lib/api";
import { toast } from "sonner";

// 1. Manages Socket.IO connection and states
export function useSocket(roomId) {
    const [isConnected, setIsConnected] = useState(false);
    const [connectingState, setConnectingState] = useState("connecting"); // connecting, connected, reconnecting, error
    const socketRef = useRef(null);

    useEffect(() => {
        if (!roomId) return;

        // Derive Socket.IO server domain from API base URL
        const socketUrl = API_BASE_URL.replace(/\/api$/, "");

        console.log("Connecting to socket server:", socketUrl);
        const socket = io(socketUrl, {
            withCredentials: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            setIsConnected(true);
            setConnectingState("connected");
            console.log("Socket connected successfully");
        });

        socket.on("disconnect", (reason) => {
            setIsConnected(false);
            if (reason === "io server disconnect") {
                // Reconnect manually if server disconnected the socket
                socket.connect();
            }
            setConnectingState("reconnecting");
            console.warn("Socket disconnected:", reason);
        });

        socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
            setConnectingState("error");
            toast.error("Socket connection failed. Retrying...");
        });

        socket.on("reconnect_attempt", (attempt) => {
            setConnectingState("reconnecting");
            console.log(`Reconnection attempt #${attempt}`);
        });

        socket.on("reconnect", () => {
            setIsConnected(true);
            setConnectingState("connected");
            toast.success("Reconnected to watch party!");
            // Re-join the room automatically after reconnecting
            socket.emit("room:join", { roomId });
        });

        return () => {
            socket.disconnect();
        };
    }, [roomId]);

    return { socket: socketRef.current, isConnected, connectingState };
}

// 2. Manages room metadata and participant roster
export function useWatchRoom(socket, roomId) {
    const [roomMeta, setRoomMeta] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [messages, setMessages] = useState([]);
    const [playbackState, setPlaybackState] = useState(null);
    const [roomEnded, setRoomEnded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!socket || !roomId) return;

        // Join room once socket is connected
        socket.emit("room:join", { roomId });

        // Listen for room state setup
        socket.on("room:state", (state) => {
            setRoomMeta({
                roomId: state.roomId,
                movieId: state.movieId,
                mediaType: state.mediaType,
                movieName: state.movieName,
                posterPath: state.posterPath,
                description: state.description,
                hostId: state.hostId
            });
            setPlaybackState(state.playbackState || null);
            setParticipants(state.participants);
            setMessages(state.messages || []);
            setError(null);
        });

        // Listen for errors (e.g. room not found)
        socket.on("room:error", (data) => {
            console.error("Room error:", data.message);
            setError(data.message);
            toast.error(data.message);
        });

        // Listen for user join/leave events
        socket.on("user:joined", (data) => {
            setParticipants(data.participants);
            toast(`${data.userName} joined the room`, { icon: "👋" });
        });

        socket.on("user:left", (data) => {
            setParticipants(data.participants);
            toast(`${data.userName} left the room`, { icon: "🚪" });
        });

        socket.on("room:ended", (data) => {
            setRoomEnded(true);
            toast.info(data.message || "The host has ended the watch party.");
        });

        return () => {
            socket.off("room:state");
            socket.off("room:error");
            socket.off("user:joined");
            socket.off("user:left");
            socket.off("room:ended");
        };
    }, [socket, roomId]);

    return { roomMeta, playbackState, participants, messages, setMessages, roomEnded, error };
}

// 3. Synchronizes video playback between host and visitors
export function usePlaybackSync(socket, videoRef, isHost, initialPlaybackState, videoReady) {
    const isApplyingUpdate = useRef(false);

    // Apply initial state
    useEffect(() => {
        if (!videoRef.current || !initialPlaybackState || !videoReady) return;
        const video = videoRef.current;

        isApplyingUpdate.current = true;
        
        // Sync initial time
        if (initialPlaybackState.currentTime !== undefined) {
            // Apply drift offset based on latency since last update
            const elapsed = (Date.now() - new Date(initialPlaybackState.lastUpdated).getTime()) / 1000;
            const targetTime = initialPlaybackState.isPlaying 
                ? initialPlaybackState.currentTime + Math.min(elapsed, 10) // cap latency addition to 10s max to avoid jumps
                : initialPlaybackState.currentTime;

            video.currentTime = targetTime;
        }

        // Sync initial state
        if (initialPlaybackState.isPlaying) {
            video.play().catch(() => {});
        } else {
            video.pause();
        }

        setTimeout(() => {
            isApplyingUpdate.current = false;
        }, 300);
    }, [initialPlaybackState, videoReady, videoRef]);

    useEffect(() => {
        if (!socket || !videoRef.current || !videoReady) return;
        const video = videoRef.current;

        // Visitor Listeners: Apply host changes
        const handleServerPlay = ({ time }) => {
            if (isHost) return;
            isApplyingUpdate.current = true;
            video.currentTime = time;
            video.play().catch(() => {});
            setTimeout(() => { isApplyingUpdate.current = false; }, 100);
        };

        const handleServerPause = ({ time }) => {
            if (isHost) return;
            isApplyingUpdate.current = true;
            video.currentTime = time;
            video.pause();
            setTimeout(() => { isApplyingUpdate.current = false; }, 100);
        };

        const handleServerSeek = ({ time }) => {
            if (isHost) return;
            isApplyingUpdate.current = true;
            video.currentTime = time;
            setTimeout(() => { isApplyingUpdate.current = false; }, 100);
        };

        const handleServerSync = ({ time, isPlaying }) => {
            if (isHost) return;
            isApplyingUpdate.current = true;

            // Simple drift correction: adjust time if out of sync by more than 2 seconds
            if (Math.abs(video.currentTime - time) > 2) {
                video.currentTime = time;
            }

            if (isPlaying && video.paused) {
                video.play().catch(() => {});
            } else if (!isPlaying && !video.paused) {
                video.pause();
            }

            setTimeout(() => { isApplyingUpdate.current = false; }, 100);
        };

        socket.on("movie:play", handleServerPlay);
        socket.on("movie:pause", handleServerPause);
        socket.on("movie:seek", handleServerSeek);
        socket.on("movie:sync", handleServerSync);

        // Host Listeners: Emit changes to server
        const handleLocalPlay = () => {
            if (!isHost) return;
            if (isApplyingUpdate.current) return;
            socket.emit("movie:play", { time: video.currentTime });
        };

        const handleLocalPause = () => {
            if (!isHost) return;
            if (isApplyingUpdate.current) return;
            socket.emit("movie:pause", { time: video.currentTime });
        };

        const handleLocalSeeking = () => {
            if (!isHost) return;
            if (isApplyingUpdate.current) return;
            socket.emit("movie:seek", { time: video.currentTime });
        };

        video.addEventListener("play", handleLocalPlay);
        video.addEventListener("pause", handleLocalPause);
        video.addEventListener("seeking", handleLocalSeeking);

        // Host Synchronization Heartbeat: Sync playback properties periodically (every 3s)
        let syncInterval = null;
        if (isHost) {
            syncInterval = setInterval(() => {
                if (isApplyingUpdate.current) return;
                socket.emit("movie:sync", {
                    time: video.currentTime,
                    isPlaying: !video.paused
                });
            }, 3000);
        }

        return () => {
            socket.off("movie:play", handleServerPlay);
            socket.off("movie:pause", handleServerPause);
            socket.off("movie:seek", handleServerSeek);
            socket.off("movie:sync", handleServerSync);
            video.removeEventListener("play", handleLocalPlay);
            video.removeEventListener("pause", handleLocalPause);
            video.removeEventListener("seeking", handleLocalSeeking);
            if (syncInterval) clearInterval(syncInterval);
        };
    }, [socket, videoReady, videoRef, isHost]);
}

// 4. Manages room live chat messages and sends messages
export function useRoomChat(socket, initialMessages) {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (initialMessages) {
            setMessages(initialMessages);
        }
    }, [initialMessages]);

    useEffect(() => {
        if (!socket) return;

        // Listen for new chat messages
        socket.on("chat:message", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        // Listen for chat errors (e.g. rate limit, validation error)
        socket.on("chat:error", (data) => {
            toast.error(data.message);
        });

        return () => {
            socket.off("chat:message");
            socket.off("chat:error");
        };
    }, [socket]);

    const sendMessage = (text) => {
        if (!socket) return;
        if (!text || text.trim() === "") return;
        socket.emit("chat:send", { message: text });
    };

    return { messages, sendMessage };
}
