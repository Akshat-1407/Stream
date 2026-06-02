"use client";

import { API_BASE_URL } from '@/lib/api';
import { FolderLockIcon, Crown } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useSearchParams } from 'next/navigation';


export default function JioPlus() {

    const searchParams = useSearchParams();
    const videoId = searchParams.get('id');

    const userData = useSelector((state) => state.user);

    const [videoUrl, setVideoUrl] = useState(null);

    useEffect(() => {
        if (videoId) {
            setVideoUrl(`${API_BASE_URL}/video/watch/?id=${videoId}`);
        }
    }, [videoId]);

    // If user is not logged in
    if (!userData.isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center h-screen w-full gap-4">
                <FolderLockIcon
                    className="w-32 h-32 text-slate-400"
                    strokeWidth={1.2}
                />
                <p className="text-base text-slate-400">
                    Login to view premium content.
                </p>
                <Link
                    href={"/login"}
                    className="bg-rose-500 hover:bg-rose-600 rounded-xl w-30 flex items-center justify-center text-white cursor-pointer p-2 mt-4"
                >
                    Login
                </Link>
            </div>
        );
    }

    // If user is not Premium
    if (!userData.user?.isPremium) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-black to-slate-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-rose-500/20 rounded-2xl p-8 md:p-12 text-center shadow-2xl">

                        <div className="flex justify-center mb-6">
                            <div className="bg-linear-to-br from-rose-500 to-pink-600 p-4 rounded-full">
                                <Crown className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-3">Premium Access Required</h2>

                        <p className="text-slate-300 text-lg mb-2">Unlock exclusive premium content</p>
                        <p className="text-slate-400 text-sm mb-8">Subscribe to Jio+ and enjoy unlimited premium videos</p>

                        <Link
                            href="/subscription"
                            className="w-full bg-linear-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center gap-2 shadow-lg"
                        >
                            <Crown className="w-5 h-5" />
                            Upgrade to Premium
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // If video url is not Present
    if (!videoUrl) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <p className="text-slate-400">Loading video...</p>
            </div>
        );
    }

    return (
        <div className="w-screen flex justify-center">
            <video
                src={videoUrl}
                controls
                autoPlay
                muted
                className="w-[80%]"
                crossOrigin="anonymous"  // crossOrigin is needed to handle CORS for video resources from a different domain
            />
        </div>
    );
}
