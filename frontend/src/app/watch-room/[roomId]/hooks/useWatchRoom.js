import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useWatchRoom(socket, roomId) {
  const [roomMeta, setRoomMeta] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [playbackState, setPlaybackState] = useState(null);
  const [roomEnded, setRoomEnded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit("room:join", { roomId });

    socket.on("room:state", (state) => {
      setRoomMeta({
        roomId: state.roomId,
        movieId: state.movieId,
        mediaType: state.mediaType,
        movieName: state.movieName,
        posterPath: state.posterPath,
        description: state.description,
        hostId: state.hostId,
      });
      setPlaybackState(state.playbackState || null);
      setParticipants(state.participants);
      setMessages(state.messages || []);
      setError(null);
    });

    socket.on("room:error", (data) => {
      console.error("Room error:", data.message);
      setError(data.message);
      toast.error(data.message);
    });

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

  return {
    roomMeta,
    playbackState,
    participants,
    messages,
    setMessages,
    roomEnded,
    error,
  };
}