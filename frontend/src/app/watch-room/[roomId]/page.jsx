"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { api, ENDPOINT, API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Film, Loader2 } from "lucide-react";
import { toast } from "sonner";

// import { useSocket, useWatchRoom, usePlaybackSync, useRoomChat } from "./watchRoomHooks";

import { useSocket } from "./hooks/useSocket";
import { useWatchRoom } from "./hooks/useWatchRoom";
import { usePlaybackSync } from "./hooks/usePlaybackSync";
import { useRoomChat } from "./hooks/useRoomChat";

import WatchRoomVideo from "@/components/watch-room/WatchRoomVideo";
import WatchRoomActions from "@/components/watch-room/WatchRoomActions";
import WatchRoomInfo from "@/components/watch-room/WatchRoomInfo";
import WatchRoomChat from "@/components/watch-room/WatchRoomChat";
import EndRoomDialog from "@/components/watch-room/EndRoomDialog";

export default function WatchRoomPage() {
    const { roomId } = useParams();
    const router = useRouter();
    const { isLoggedIn, user } = useSelector((state) => state.user);

    const [roomDetails, setRoomDetails] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [loadingRoom, setLoadingRoom] = useState(true);
    const [roomError, setRoomError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [videoReady, setVideoReady] = useState(false);
    const [isEndingRoom, setIsEndingRoom] = useState(false);
    const [isEndDialogOpen, setIsEndDialogOpen] = useState(false);
    const [isViewerMuted, setIsViewerMuted] = useState(false);
    const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);

    const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

    const videoRef = useRef(null);

    // 1. Fetch Room Meta details via HTTP first
    useEffect(() => {
        if (!isLoggedIn) {
            toast.error("Please login to access the watch room");
            router.push("/login");
            return;
        }

        const fetchDetails = async () => {
            try {
                setLoadingRoom(true);
                const res = await api.get(ENDPOINT.getRoomDetails(roomId));
                if (res.data?.status === "success") {
                    setRoomDetails(res.data.room);
                } else {
                    setRoomError("Room not found");
                }
            } catch (err) {
                console.error("Error fetching room metadata:", err);
                setRoomError(err.response?.data?.message || "Failed to load watch party room.");
            } finally {
                setLoadingRoom(false);
            }
        };

        fetchDetails();
    }, [roomId, isLoggedIn]);

    // 2. Fetch R2 Video Stream URL once room details are available
    useEffect(() => {
        if (!roomDetails?.movieId) return;

        const fetchStream = async () => {
            try {
                setVideoReady(false);
                const res = await fetch(`${API_BASE_URL}/video/watch?id=${roomDetails.movieId}`);
                const data = await res.json();
                if (res.ok && data.streamUrl) {
                    setVideoUrl(data.streamUrl);
                } else {
                    toast.error("Premium video unavailable. Ensure you have subscription access.");
                }
            } catch (err) {
                console.error("Error fetching video stream:", err);
                toast.error("Error connecting to video streaming service.");
            }
        };

        fetchStream();
    }, [roomDetails]);

    // 3. Setup Socket.IO connections and custom hooks
    const { socket, connectingState } = useSocket(roomId);
    
    const { 
        roomMeta,
        playbackState,
        participants, 
        messages: roomMessages, 
        roomEnded,
        error: socketError 
    } = useWatchRoom(socket, roomId);

    const isHost = roomMeta ? roomMeta.hostId === user?._id.toString() : false;

    // Synchronize play, pause, seek
    usePlaybackSync(socket, videoRef, isHost, playbackState, videoReady);

    // Synchronize chat
    const { messages, sendMessage } = useRoomChat(socket, roomMessages);

    useEffect(() => {
        if (!roomEnded) return;

        const video = videoRef.current;
        if (video) {
            video.pause();
            video.removeAttribute("src");
            video.load();
        }

        const redirectTimer = setTimeout(() => {
            router.push("/jio+");
        }, 1200);

        return () => clearTimeout(redirectTimer);
    }, [roomEnded, router]);

    const copyInviteLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            toast.success("Watch room link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    const handleEndRoom = () => {
        if (!isHost || !socket || isEndingRoom) return;

        setIsEndingRoom(true);
        setIsEndDialogOpen(false);
        socket.emit("room:end");
    };

    const handleToggleViewerMute = () => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = !video.muted;
        setIsViewerMuted(video.muted);
    };

    const handleToggleFullscreen = async () => {
        const video = videoRef.current;
        if (!video) return;

        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            } else {
                await video.requestFullscreen();
            }
        } catch (err) {
            toast.error("Fullscreen is not available in this browser.");
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsVideoFullscreen(Boolean(document.fullscreenElement));
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    if (!isLoggedIn) {
        return null;
    }

    if (loadingRoom) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] w-full gap-4 text-slate-400">
                <Loader2 className="w-12 h-12 animate-spin text-rose-500" />
                <p className="text-lg">Preparing your watch party...</p>
            </div>
        );
    }

    if (roomError || socketError) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] w-full gap-4 text-slate-400 p-6">
                <Film className="w-20 h-20 text-slate-600" />
                <h2 className="text-2xl font-bold text-white">Watch Party Unavailable</h2>
                <p className="text-center text-slate-400 max-w-md">
                    {roomError || socketError || "The watch party room could not be loaded or joined."}
                </p>
                <Button onClick={() => router.push("/")} className="bg-rose-500 hover:bg-rose-600 text-white mt-4">
                    Return to Catalog
                </Button>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-72px)] overflow-hidden bg-black text-white flex flex-col md:flex-row font-sans">
            {/* Left Column: Video Screen & Meta Details */}
            <div className="flex-1 flex flex-col h-full overflow-y-auto scrollbar-hide">
                {/* Connection Status Banner (subtle floating indicator) */}
                {connectingState !== "connected" && (
                    <div className="bg-rose-600 text-white text-xs px-4 py-1.5 flex items-center justify-center gap-2 font-medium z-10 select-none animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>{connectingState === "connecting" ? "Connecting to Watch Party..." : "Reconnecting to Live Stream..."}</span>
                    </div>
                )}

                <WatchRoomVideo
                    videoUrl={videoUrl}
                    videoRef={videoRef}
                    isHost={isHost}
                    onLoadedMetadata={() => setVideoReady(true)}
                    isViewerMuted={isViewerMuted}
                    isVideoFullscreen={isVideoFullscreen}
                    onToggleMute={handleToggleViewerMute}
                    onToggleFullscreen={handleToggleFullscreen}
                />

                <WatchRoomInfo
                    roomId={roomId}
                    movieName={roomDetails?.movieName}
                    description={roomDetails?.description}
                    hostName={roomDetails?.host?.name}
                    actions={
                        <WatchRoomActions
                            copied={copied}
                            isHost={isHost}
                            isEndingRoom={isEndingRoom}
                            isMobileChatOpen={isMobileChatOpen}
                            onCopyLink={copyInviteLink}
                            onOpenEndDialog={() => setIsEndDialogOpen(true)}
                            onToggleMobileChat={() => setIsMobileChatOpen(!isMobileChatOpen)}
                        />
                    }
                />

                <EndRoomDialog
                    open={isEndDialogOpen}
                    isEnding={isEndingRoom}
                    onOpenChange={setIsEndDialogOpen}
                    onConfirm={handleEndRoom}
                />
            </div>

            <WatchRoomChat
                messages={messages}
                participants={participants}
                user={user}
                hostId={roomDetails?.host?._id}
                isMobileChatOpen={isMobileChatOpen}
                onClose={() => setIsMobileChatOpen(false)}
                onSendMessage={sendMessage}
            />
        </div>
    );
}
