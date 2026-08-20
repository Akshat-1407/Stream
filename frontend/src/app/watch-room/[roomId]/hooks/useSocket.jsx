import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { API_BASE_URL } from "@/lib/api";
import { toast } from "sonner";

export function useSocket(roomId) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectingState, setConnectingState] = useState("connecting");
  const socketRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    const socketUrl = API_BASE_URL.replace(/\/api$/, "");

    console.log("Connecting to socket server:", socketUrl);
    const socket = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
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
      socket.emit("room:join", { roomId });
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  return { socket: socketRef.current, isConnected, connectingState };
}