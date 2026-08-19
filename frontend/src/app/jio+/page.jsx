"use client";

import { API_BASE_URL } from '@/lib/api';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Title from '@/components/features/Title';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export default function VideoCatalog() {
    const [categories, setCategories] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/video`);
                const result = await response.json();
                if (result.status === "success") {
                    setCategories(result.data);
                }
            } catch (err) {
                console.error("Failed to fetch videos:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-slate-400">
                Loading videos...
            </div>
        );
    }

    // Extract trending section separately
    const trendingVideos = categories["trending"] || [];
    const genreCategories = Object.entries(categories).filter(([genre]) => genre !== "trending");

    return (
        <div className="min-h-screen bg-black text-white px-6 md:px-12 py-6 space-y-12 font-sans">
            {/* Top Section: Featured Hero Carousel */}
            {trendingVideos.length > 0 && (
                <section className="relative w-full">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full relative group/carousel"
                    >
                        <CarouselContent className="-ml-4">
                            {trendingVideos.map((video) => (
                                <CarouselItem 
                                    key={video.id} 
                                    className="pl-4 basis-full sm:basis-1/2 md:basis-5/12 lg:basis-5/12"
                                >
                                    <Link
                                        href={`/jio+/watch?id=${encodeURIComponent(video.id)}&name=${encodeURIComponent(video.name)}`}
                                        className="group block relative rounded-2xl overflow-hidden bg-neutral-900 aspect-video border border-transparent transition-all duration-300"
                                    >
                                        <img
                                            src={`${API_BASE_URL}/video/thumbnail?videoId=${encodeURIComponent(video.id)}`}
                                            alt={video.name}
                                            className="w-full h-full object-cover transition-transform duration-500"
                                        />

                                        {/* Subtle Dark Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    </Link>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* Carousel Navigation Buttons */}
                        <div className="absolute bottom-4 right-8 flex gap-3 z-10 pointer-events-auto">
                            <CarouselPrevious className="static translate-x-0 translate-y-0 w-10 h-10 bg-black/60 border-slate-700 text-white hover:bg-rose-600 hover:text-white transition-colors" />
                            <CarouselNext className="static translate-x-0 translate-y-0 w-10 h-10 bg-black/60 border-slate-700 text-white hover:bg-rose-600 hover:text-white transition-colors" />
                        </div>
                    </Carousel>
                </section>
            )}

            {/* Main Content Rows (Categorized Genres) */}
            {genreCategories.length === 0 && trendingVideos.length === 0 ? (
                <p className="text-slate-400">No videos available.</p>
            ) : (
                genreCategories.map(([genre, videos]) => (
                    <section key={genre} className="space-y-4">
                        {/* Genre Header */}
                        <h2 className="text-2xl font-semibold capitalize text-white">
                            {genre}
                        </h2>

                        {/* Movies Row */}
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                            {videos.map((video) => (
                                <Link
                                    key={video.id}
                                    href={`/jio+/watch?id=${encodeURIComponent(video.id)}&name=${encodeURIComponent(video.name)}`}
                                    className="group flex-none w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] snap-start"
                                >
                                    {/* Poster Card Container */}
                                    <div className="aspect-[2/3] w-full relative overflow-hidden rounded-xl bg-neutral-900 border border-transparent transition-all duration-300">
                                        <img
                                            src={`${API_BASE_URL}/video/thumbnail?videoId=${encodeURIComponent(video.id)}`}
                                            alt={video.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black opacity-0 group-hover:opacity-40 transition-opacity duration-300" />

                                        {/* Play Icon on Hover */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="bg-rose-500 hover:bg-rose-600 rounded-full p-3">
                                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Movie Title */}
                                    <div className="mt-2.5 text-md font-normal text-slate-200 group-hover:text-white transition-colors truncate">
                                        <Title 
                                            title={video.name.split(" ")
                                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                .join(" ")}
                                        />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))
            )}
        </div>
    );
}


// import { api, ENDPOINT, getStreamingVideoThumbnail, getStreamingVideo } from "../../lib/api";
// import Link from "next/link";
// import Image from "next/image";
// import { FolderX } from "lucide-react";

// export default async function JioPlus() {
//     const response = await api.get(ENDPOINT.fetchAllStreamingVideos);
//     const videos = response?.data?.data;

//     if (!videos || videos.length === 0) {
//         return (
//             <main className="min-h-screen mt-20 p-4 md:p-8">
//                 <h1 className="text-3xl md:text-4xl font-bold mb-8">Jio+ Premium Videos</h1>
//                 <div className="flex flex-col items-center justify-center h-[60vh] w-full gap-4">
//                     <FolderX className="w-32 h-32 text-slate-400" strokeWidth={1.2} />
//                     <p className="text-lg text-gray-500">No premium videos available.</p>
//                 </div>
//             </main>
//         );
//     }

//     return (
//         <main className="min-h-screen p-8">
//             <div className="mb-8">
//                 <h1 className="text-3xl md:text-4xl font-bold mb-2">Jio+ Premium Videos</h1>
//                 <p className="text-slate-400">Exclusive premium content available for subscribers</p>
//             </div>

//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
//                 {videos.map((video, index) => (
//                     <Link
//                         key={index}
//                         href={getStreamingVideo(video?.id, video?.name)}
//                         className="group relative overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105 flex flex-col"
//                     >
//                         <div className="relative w-full aspect-2/3 bg-slate-800 overflow-hidden rounded-lg">
//                             <Image
//                                 src={getStreamingVideoThumbnail(video?.id)}
//                                 alt={video?.name || "Premium Video"}
//                                 fill
//                                 className="object-cover transition-opacity duration-300 group-hover:opacity-80"
//                                 quality={30}
//                                 unoptimized
//                             />
//                             <div className="absolute inset-0 bg-linear-to-b from-transparent to-black opacity-0 group-hover:opacity-50 transition-opacity duration-300" />

//                             {/* Play Icon on Hover */}
//                             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                                 <div className="bg-rose-500 hover:bg-rose-600 rounded-full p-3">
//                                     <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
//                                         <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
//                                     </svg>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="mt-3 flex-1 flex flex-col">
//                             <p className="text-sm font-semibold text-white truncate group-hover:text-rose-400 transition-colors">
//                                 {video.name.split(" ")
//                                     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//                                     .join(" ") || `Video ${video.id}`}
//                             </p>
//                             <p className="text-xs text-slate-400 mt-1">Premium Content</p>
//                         </div>
//                     </Link>
//                 ))}
//             </div>
//         </main>
//     );
// }