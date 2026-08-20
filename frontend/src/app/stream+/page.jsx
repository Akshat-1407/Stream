"use client";

import { API_BASE_URL } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Autoplay from 'embla-carousel-autoplay';
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

    const autoplay = useRef(
        Autoplay({
            delay: 3000,
            stopOnMouseEnter: true,
            stopOnInteraction: false,
        })
    );

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

    const trendingVideos = categories["trending"] || [];
    const genreCategories = Object.entries(categories).filter(([genre]) => genre !== "trending");

    return (
        <div className="min-h-screen bg-black text-white px-6 md:px-12 py-6 space-y-12 font-sans">
            {/* Top Section: Featured Hero Carousel */}
            {trendingVideos.length > 0 && (
                <section className="relative w-full">
                    <Carousel
                        opts={{
                            align: "center",
                            loop: true,
                        }}
                        plugins={[autoplay.current]}
                        className="w-full px-4 md:px-0 relative group/carousel"
                    >
                        <CarouselContent>
                            {trendingVideos.map((video) => (
                                <CarouselItem
                                    key={video.id}
                                    className="w-full max-w-175 h-125"
                                >
                                    <Link
                                        href={`/stream+/watch?id=${encodeURIComponent(video.id)}&name=${encodeURIComponent(video.name)}`}
                                        className="block relative w-full h-full"
                                    >
                                        <Image
                                            src={`${API_BASE_URL}/video/thumbnail?videoId=${encodeURIComponent(video.id)}`}
                                            alt={video.name}
                                            width={700}
                                            height={500}
                                            className="bg-slate-600 rounded-lg object-cover w-full h-full"
                                        />
                                    </Link>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* Carousel Navigation Buttons */}
                        <div className="absolute bottom-4 right-8 flex gap-7 z-10 pointer-events-auto">
                            <CarouselPrevious className="static translate-x-0 translate-y-0 w-15 h-15 bg-black/70 border-slate-700 text-white" />
                            <CarouselNext className="static translate-x-0 translate-y-0 w-15 h-15 bg-black/70 border-slate-700 text-white" />
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
                                    href={`/stream+/watch?id=${encodeURIComponent(video.id)}&name=${encodeURIComponent(video.name)}`}
                                    className="group flex-none w-40 sm:w-45 md:w-50 lg:w-55 snap-start"
                                >
                                    {/* Poster Card Container */}
                                    <div className="aspect-2/3 w-full relative overflow-hidden rounded-xl bg-neutral-900 border border-transparent transition-all duration-300">
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