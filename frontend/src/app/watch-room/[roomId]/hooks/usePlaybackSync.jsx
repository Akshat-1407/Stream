import { useEffect, useRef } from "react";

export function usePlaybackSync(
  socket,
  videoRef,
  isHost,
  initialPlaybackState,
  videoReady
) {
  const isApplyingUpdate = useRef(false);

  // Apply initial playback state
  useEffect(() => {
    if (!videoRef.current || !initialPlaybackState || !videoReady) return;
    const video = videoRef.current;

    isApplyingUpdate.current = true;

    if (initialPlaybackState.currentTime !== undefined) {
      const elapsed =
        (Date.now() - new Date(initialPlaybackState.lastUpdated).getTime()) / 1000;
      const targetTime = initialPlaybackState.isPlaying
        ? initialPlaybackState.currentTime + Math.min(elapsed, 10)
        : initialPlaybackState.currentTime;

      video.currentTime = targetTime;
    }

    if (initialPlaybackState.isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }

    setTimeout(() => {
      isApplyingUpdate.current = false;
    }, 300);
  }, [initialPlaybackState, videoReady, videoRef]);

  // Synchronize dynamic events between host and visitors
  useEffect(() => {
    if (!socket || !videoRef.current || !videoReady) return;
    const video = videoRef.current;

    const handleServerPlay = ({ time }) => {
      if (isHost) return;
      isApplyingUpdate.current = true;
      video.currentTime = time;
      video.play().catch(() => {});
      setTimeout(() => {
        isApplyingUpdate.current = false;
      }, 100);
    };

    const handleServerPause = ({ time }) => {
      if (isHost) return;
      isApplyingUpdate.current = true;
      video.currentTime = time;
      video.pause();
      setTimeout(() => {
        isApplyingUpdate.current = false;
      }, 100);
    };

    const handleServerSeek = ({ time }) => {
      if (isHost) return;
      isApplyingUpdate.current = true;
      video.currentTime = time;
      setTimeout(() => {
        isApplyingUpdate.current = false;
      }, 100);
    };

    const handleServerSync = ({ time, isPlaying }) => {
      if (isHost) return;
      isApplyingUpdate.current = true;

      if (Math.abs(video.currentTime - time) > 2) {
        video.currentTime = time;
      }

      if (isPlaying && video.paused) {
        video.play().catch(() => {});
      } else if (!isPlaying && !video.paused) {
        video.pause();
      }

      setTimeout(() => {
        isApplyingUpdate.current = false;
      }, 100);
    };

    socket.on("movie:play", handleServerPlay);
    socket.on("movie:pause", handleServerPause);
    socket.on("movie:seek", handleServerSeek);
    socket.on("movie:sync", handleServerSync);

    const handleLocalPlay = () => {
      if (!isHost || isApplyingUpdate.current) return;
      socket.emit("movie:play", { time: video.currentTime });
    };

    const handleLocalPause = () => {
      if (!isHost || isApplyingUpdate.current) return;
      socket.emit("movie:pause", { time: video.currentTime });
    };

    const handleLocalSeeking = () => {
      if (!isHost || isApplyingUpdate.current) return;
      socket.emit("movie:seek", { time: video.currentTime });
    };

    video.addEventListener("play", handleLocalPlay);
    video.addEventListener("pause", handleLocalPause);
    video.addEventListener("seeking", handleLocalSeeking);

    let syncInterval = null;
    if (isHost) {
      syncInterval = setInterval(() => {
        if (isApplyingUpdate.current) return;
        socket.emit("movie:sync", {
          time: video.currentTime,
          isPlaying: !video.paused,
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