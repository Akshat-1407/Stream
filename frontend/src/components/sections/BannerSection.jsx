import { Skeleton } from "../ui/skeleton";
import BannerCarousel from "./BannerCarousel";

export default async function BannerSection({ bannerData }) {
  const trendingPosts = await bannerData();

  return <BannerCarousel trendingPosts={trendingPosts} />;
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