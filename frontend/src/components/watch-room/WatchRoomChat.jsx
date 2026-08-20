"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Crown, MessageSquare, Send } from "lucide-react";

export default function WatchRoomChat({
    messages,
    participants,
    user,
    hostId,
    isMobileChatOpen,
    onClose,
    onSendMessage
}) {
    const [chatInput, setChatInput] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!chatInput.trim()) return;
        onSendMessage(chatInput);
        setChatInput("");
    };

    return (
        <div className={`w-full md:w-80 lg:w-96 bg-neutral-900/40 border-t md:border-t-0 md:border-l border-neutral-800/60 flex flex-col h-full shrink-0 ${isMobileChatOpen ? "fixed inset-0 z-50 bg-neutral-950 flex" : "hidden md:flex"}`}>
            <div className="h-16 border-b border-neutral-800/60 px-4 flex items-center justify-between bg-neutral-950 shrink-0">
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-rose-500" />
                    <h2 className="font-bold text-white text-base">Live Chat</h2>
                    <span className="text-xs bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                        {participants.length} online
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="md:hidden text-slate-400 hover:text-white"
                >
                    Close
                </Button>
            </div>

            <div className="px-4 py-2 bg-neutral-900/20 border-b border-neutral-800/40 flex items-center gap-1 overflow-x-auto scrollbar-hide text-xs text-slate-400 whitespace-nowrap">
                <span className="font-semibold text-slate-500 shrink-0">In Room:</span>
                {participants.map((participant, index) => (
                    <span key={`${participant.userId}-${index}`} className="bg-neutral-800 px-2 py-0.5 rounded-md text-slate-300 max-w-20 truncate">
                        {participant.name}
                    </span>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-neutral-950/20">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-2">
                        <MessageSquare className="w-10 h-10 stroke-[1.5]" />
                        <p className="text-xs">No messages yet. Say hello!</p>
                    </div>
                ) : (
                    messages.map((message, index) => {
                        const isMe = message.sender === user?._id || message.senderName === user?.name;
                        const isMessageHost = message.sender === hostId;

                        return (
                            <div key={`${message.timestamp}-${index}`} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1 px-1">
                                    {isMessageHost && <Crown className="w-3 h-3 text-yellow-500" />}
                                    <span className={`font-semibold ${isMe ? "text-rose-400" : "text-slate-300"}`}>
                                        {isMe ? "You" : message.senderName}
                                    </span>
                                    <span className="text-[10px] scale-90 opacity-70">
                                        {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                </div>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed wrap-break-word ${
                                    isMe
                                        ? "bg-rose-600 text-white rounded-tr-none"
                                        : "bg-neutral-800 text-slate-100 rounded-tl-none border border-neutral-800/40"
                                }`}>
                                    {message.message}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-800/60 bg-neutral-950 shrink-0">
                <div className="flex gap-2 bg-neutral-900 border border-neutral-800 rounded-xl p-1.5 focus-within:border-neutral-700 transition-colors">
                    <input
                        type="text"
                        value={chatInput}
                        onChange={(event) => setChatInput(event.target.value)}
                        placeholder="Type a message..."
                        className="bg-transparent flex-1 outline-none text-sm px-2 text-white placeholder:text-gray-500"
                    />
                    <Button
                        type="submit"
                        disabled={!chatInput.trim()}
                        size="icon"
                        className="h-8 w-8 rounded-lg bg-rose-500 hover:bg-rose-600 text-white shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
