"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Maximize, Minimize, Volume2, VolumeX } from "lucide-react";

export default function WatchRoomVideo({
    videoUrl,
    videoRef,
    isHost,
    onLoadedMetadata,
    isViewerMuted,
    isVideoFullscreen,
    onToggleMute,
    onToggleFullscreen
}) {
    return (
        <div className="relative bg-neutral-950 aspect-video w-full flex items-center justify-center max-h-[75vh]">
            {videoUrl ? (
                <div className="relative w-full h-full">
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        onLoadedMetadata={onLoadedMetadata}
                        controls={isHost}
                        muted={false}
                        playsInline
                        className={`w-full h-full object-contain ${!isHost ? "pointer-events-none" : ""}`}
                        crossOrigin="anonymous"
                    />
                    {!isHost && (
                        <div className="absolute inset-0 z-10 bg-transparent cursor-not-allowed select-none pointer-events-auto" />
                    )}
                    {!isHost && (
                        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
                            <Button
                                type="button"
                                size="icon"
                                onClick={onToggleMute}
                                title={isViewerMuted ? "Unmute video" : "Mute video"}
                                aria-label={isViewerMuted ? "Unmute video" : "Mute video"}
                                className="bg-black/75 text-white hover:bg-black"
                            >
                                {isViewerMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </Button>
                            <Button
                                type="button"
                                size="icon"
                                onClick={onToggleFullscreen}
                                title={isVideoFullscreen ? "Exit fullscreen" : "Fullscreen"}
                                aria-label={isVideoFullscreen ? "Exit fullscreen" : "Fullscreen"}
                                className="bg-black/75 text-white hover:bg-black"
                            >
                                {isVideoFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center gap-3 p-8 text-slate-500">
                    <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
                    <p>Loading video stream...</p>
                </div>
            )}
        </div>
    );
}
