import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export function getWatchUrl(vidId, mediaType) {
  const prefix = mediaType === "tv" ? "tv" : "movies";
  return `${prefix}/watch?id=${vidId}`;
}

// export function getWatchUrl(vidId, mediaType, additionalData = {}) {
//   const prefix = mediaType === "tv" ? "tv" : "movies";
//   const params = new URLSearchParams({
//     title: additionalData.title || "",
//     overview: additionalData.overview || "",
//   });
//   return `${prefix}/watch?${params.toString()}`;
// }

export function injectMediaType(data, mediaType) {
  data.forEach((item) => {
     item["media_type"] = mediaType;
  });
}


export  const getMediaVideoKey = async (details) => {
  try {
    // 1. Safe access to the results array
    const videos = details?.data?.response?.results || details?.results || [];

    if (videos.length === 0) return null;

    // 2. Define our priority list (from best to "good enough")
    const findVideo = (type) => 
      videos.find((v) => v.site === "YouTube" && v.type === type);

    // 3. Try to find in order: Official Trailer, any Trailer, then Teaser
    const trailer = findVideo("Trailer");
    const teaser = findVideo("Teaser");
    const clip = findVideo("Clip");

    // Return the first one that isn't null
    return [trailer?.key || teaser?.key || clip?.key || videos[0] || null, ];

  } catch (err) {
    console.error("Error extracting video key:", err);
    return null;
  }
};