"use client";

import { api, ENDPOINT, media } from '../../lib/api';
import { FolderLockIcon, Loader2, FolderX } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { getWatchUrl } from '../../lib/utils';
import { toast } from "sonner";


function Watchlist() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [watchlistData, setWatchlistData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;

    async function getWatchlistData() {
      setIsLoading(true);

      try {
        const res = await api.get(ENDPOINT.getWishlist);
        if (res?.data?.data) {
          setWatchlistData(res?.data?.data);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
        toast.error(errorMessage);
        setWatchlistData([]);
      } finally {
        setIsLoading(false);
      }
    }
    getWatchlistData();
  }, [isLoggedIn]);


  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] w-full gap-4">
        <FolderLockIcon
          className="w-32 h-32 text-slate-400"
          strokeWidth={1.2}
        />
        <p className="text-base text-slate-400">
          Login to see your watchlist
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


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] w-full gap-4">
        <Loader2 className="w-12 h-12 text-slate-400 animate-spin" />
        <p className="text-base text-slate-400">Loading your watchlist...</p>
      </div>
    );
  }


  if (!watchlistData || watchlistData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] w-full gap-4">
        <FolderX
          className="w-32 h-32 text-slate-400"
          strokeWidth={1.2}
        />
        <p className="text-lg text-gray-500">No items in your watchlist.</p>
      </div>
    );
  }


  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">My Watchlist</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {watchlistData.map((item, index) => {
          const watchUrl = getWatchUrl(item?.id, item?.media_type, item?.poster_path, item?.name || item?.title, item?.description);

          return (
            <Link
              key={index}
              href={watchUrl}
              className="group relative overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105"
            >
              <div className="relative w-full aspect-2/3 bg-slate-800">
                {item?.poster_path && (
                  <Image
                    src={media(item.poster_path)}
                    alt={item?.name || item?.title || 'Movie'}
                    fill
                    className="object-cover transition-opacity duration-300 group-hover:opacity-80"
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-black opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
              </div>
              {/* Play Icon on Hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-rose-500 hover:bg-rose-600 rounded-full p-3">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </div>

              <div className="mt-2">
                <p className="text-sm font-medium text-white truncate group-hover:text-blue-400">
                  {item?.name || item?.title}
                </p>
                {item?.media_type && (
                  <p className="text-xs text-slate-400 mt-1">
                    {item.media_type === 'tv' ? 'TV Show' : 'Movie'}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Watchlist