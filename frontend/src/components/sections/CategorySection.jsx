import React from "react";
import { media } from "../../lib/api"
import { getWatchUrl } from "../../lib/utils";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { cn } from "../../lib/utils";
import { InboxIcon } from "lucide-react";

export default async function CategorySection({ fetcher, title, className }) {
  let categoryPost = await fetcher();
  // console.log("category post", categoryPost)

  if (!categoryPost || categoryPost.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[80vh] py-12">
        <InboxIcon
          className="w-32 h-32 text-slate-400 mb-10"
          strokeWidth={1.2}
        />
        <p className="text-lg text-gray-500">No items found.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-medium mb-6 scroll-m-25">{title}</h2>
      <ul
        className={cn(
          "flex gap-4 w-full overflow-scroll scrollbar-hide",
          className
        )}
      >
        {categoryPost?.map((vid, index) => (
          <Link key={index} href={getWatchUrl(vid?.id, vid?.media_type)}>
            <Image
              src={media(vid?.poster_path)}
              alt=""
              width={200}
              height={300}
              className="min-w-50 h-75 rounded-lg object-cover"
            />
          </Link>
        ))}
      </ul>
    </div>
  );
}

export function CategorySectionFallback() {
  return (
    <ul className="flex gap-4 w-full overflow-scroll scrollbar-hide">
      {new Array(12).fill(0).map((e, index) => (
        <Skeleton key={index} className="min-w-50 h-75 rounded-lg" />
      ))}
    </ul>
  )
}