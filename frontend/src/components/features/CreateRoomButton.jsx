"use client";

import { Button } from "../ui/button";
import { useState } from "react";
import { Users, LoaderCircle } from "lucide-react";
import { ENDPOINT, api } from "../../lib/api";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateRoomButton({ movieId, mediaType, movieName, posterPath, description }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { isLoggedIn, user } = useSelector((state) => state.user);

    const handleCreateRoom = async () => {
        if (!isLoggedIn) {
            toast.error("Please login to create a watch party");
            router.push("/login");
            return;
        }

        if (!user?.isPremium) {
            toast.error("Premium subscription required for Jio+ Watch Parties");
            router.push("/subscription");
            return;
        }

        try {
            setLoading(true);
            const res = await api.post(ENDPOINT.createRoom, {
                movieId,
                mediaType,
                movieName,
                posterPath,
                description
            });

            if (res.status === 201 && res.data?.room?.roomId) {
                toast.success("Watch room created successfully!");
                router.push(`/watch-room/${res.data.room.roomId}`);
            } else {
                toast.error("Failed to create watch room");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "An error occurred";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleCreateRoom}
            disabled={loading}
            className={`bg-[#e11d48] hover:bg-[#be123c] text-white font-medium cursor-pointer flex items-center p-4 pr-5 gap-2 transition-all ${
                loading ? "cursor-not-allowed opacity-85" : "cursor-pointer"
            }`}
        >
            {loading ? (
                <LoaderCircle className="w-4 h-4 animate-spin" />
            ) : (
                <Users className="text-white size-4" />
            )}
            <span className="mt-0.5 font-sans">Watch Party</span>
        </Button>
    );
}
