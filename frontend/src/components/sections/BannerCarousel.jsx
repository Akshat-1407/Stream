"use client";

import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

import { media } from "../../lib/api";
import { getWatchUrl } from "../../lib/utils";

export default function BannerCarousel({ trendingPosts }) {
  const autoplay = useRef(
    Autoplay({
      delay: 3000,
      stopOnMouseEnter: true,
      stopOnInteraction: false,
    })
  );

  return (
    <Carousel
      opts={{
        align: "center",
        loop: true,
      }}
      plugins={[autoplay.current]}
      className="w-full px-4 md:px-0"
    >
      <CarouselContent>
        {trendingPosts?.map((vid) => (
          <CarouselItem
            key={vid.id}
            className="w-full max-w-175 h-125"
          >
            <Link href={getWatchUrl(vid?.id, vid?.media_type, vid?.poster_path, vid?.name || vid?.title, vid?.overview)}>
              <Image
                src={media(vid.poster_path)}
                alt=""
                width={700}
                height={500}
                className="bg-slate-600 rounded-lg object-cover"
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
  );
}