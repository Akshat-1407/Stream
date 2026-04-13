import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { media } from "../../lib/api";
import { getWatchUrl } from "../../lib/utils";

export default async function BannerSection({bannerData}) {

  const trendingPosts = await bannerData();
  // console.log("trendingPosts", trendingPosts)

  return (
    <Carousel
      opts={{
        align: "center",
        loop: true,
      }}
      className="w-full px-4 md:px-0"
    >
      <CarouselContent className="">
        {trendingPosts?.map((vid) => (
          <CarouselItem key={vid.id} className="w-full max-w-175 h-125">
            <Link href={getWatchUrl(vid.id, vid.media_type)}>
              <Image
                src={media(vid?.poster_path)}
                alt=""
                width={700}
                height={500}
                className="bg-slate-600 rounded-lg object-cover"
              />
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute bottom-15 right-[8%] hidden md:flex">
        <div className="flex w-15">
          <CarouselPrevious className="w-15 h-15 cursor-pointer" />
          <CarouselNext className="w-15 h-15 ml-2 cursor-pointer" />
        </div>
      </div>
    </Carousel>
  )
}

export function BannerSectionFallback() {
  return (
    <div className="flex items-center justify-center gap-5">
      <Skeleton className="h-125 w-175 rounded-lg" />
      <Skeleton className="h-125 w-175 rounded-lg" />
      <Skeleton className="h-125 w-175 rounded-lg" />
    </div>
  )
}