import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useRoomChat(socket, initialMessages) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    if (!socket) return;

    socket.on("chat:message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("chat:error", (data) => {
      toast.error(data.message);
    });

    return () => {
      socket.off("chat:message");
      socket.off("chat:error");
    };
  }, [socket]);

  const sendMessage = (text) => {
    if (!socket || !text || text.trim() === "") return;
    socket.emit("chat:send", { message: text });
  };

  return { messages, sendMessage };
}