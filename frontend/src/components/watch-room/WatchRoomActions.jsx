"use client";

import { Button } from "@/components/ui/button";
import { Check, Loader2, MessageSquare, Share2, Trash2 } from "lucide-react";

export default function WatchRoomActions({
    copied,
    isHost,
    isEndingRoom,
    isMobileChatOpen,
    onCopyLink,
    onOpenEndDialog,
    onToggleMobileChat
}) {
    return (
        <div className="flex gap-3">
            <Button
                onClick={onCopyLink}
                className="bg-neutral-800 hover:bg-neutral-700 text-white font-medium border border-neutral-700 flex items-center gap-2"
            >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                <span>Copy Link</span>
            </Button>

            {isHost && (
                <Button
                    onClick={onOpenEndDialog}
                    disabled={isEndingRoom}
                    className="bg-red-950 hover:bg-red-900 text-red-200 font-medium border border-red-800 flex items-center gap-2"
                >
                    {isEndingRoom ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    <span>{isEndingRoom ? "Ending..." : "End Room"}</span>
                </Button>
            )}

            <Button
                onClick={onToggleMobileChat}
                className="md:hidden bg-rose-500 hover:bg-rose-600 text-white font-medium flex items-center gap-2"
                aria-expanded={isMobileChatOpen}
            >
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
            </Button>
        </div>
    );
}
