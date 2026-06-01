import { api, ENDPOINT, getStreamingVideoThumbnail } from "../../lib/api";
import Link from "next/link";
import Image from "next/image";
import { FolderX } from "lucide-react";

export default async function JioPlus() {
    const response = await api.get(ENDPOINT.fetchAllStreamingVideos);
    const videos = response?.data?.data;

    if (!videos || videos.length === 0) {
        return (
            <main className="min-h-screen mt-20 p-4 md:p-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">Jio+ Premium Videos</h1>
                <div className="flex flex-col items-center justify-center h-[60vh] w-full gap-4">
                    <FolderX className="w-32 h-32 text-slate-400" strokeWidth={1.2} />
                    <p className="text-lg text-gray-500">No premium videos available.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen p- md:p-8">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Jio+ Premium Videos</h1>
                <p className="text-slate-400">Exclusive premium content available for subscribers</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {videos.map((video, index) => (
                    <Link
                        key={index}
                        href={`jio+/watch?id=${video.id}`}
                        className="group relative overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105 flex flex-col"
                    >
                        <div className="relative w-full aspect-2/3 bg-slate-800 overflow-hidden rounded-lg">
                            <Image
                                src={getStreamingVideoThumbnail(video.id)}
                                alt={video.name || "Premium Video"}
                                fill
                                className="object-cover transition-opacity duration-300 group-hover:opacity-80"
                                quality={30}
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-linear-to-b from-transparent to-black opacity-0 group-hover:opacity-50 transition-opacity duration-300" />

                            {/* Play Icon on Hover */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="bg-rose-500 hover:bg-rose-600 rounded-full p-3">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 flex-1 flex flex-col">
                            <p className="text-sm font-semibold text-white truncate group-hover:text-rose-400 transition-colors">
                                {video.name || `Video ${video.id}`}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Premium Content</p>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}