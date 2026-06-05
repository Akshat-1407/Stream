import { getMediaVideoKey } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import ShareButton from "../../../components/features/ShareButton";
import WatchlistButton from "../../../components/features/WatchlistButton";
import { api, ENDPOINT } from "@/lib/api";
import { FilmIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = async ({ searchParams }) => {
  const { id, media_type, poster_path, name, description } = await searchParams;
  const details = (await api.get(ENDPOINT.getMovieDetails(id)));
  const key = await getMediaVideoKey(details);

  return (
    <div className="mt-20">
      {details ? (
        <>
          <iframe
            title={details?.key}
            src={`https://www.youtube-nocookie.com/embed/${key}`}
            className="w-full aspect-video lg:h-[70vh]"
            allow="fullscreen"
            allowFullScreen
          />
          <div className="flex gap-4 px-5 lg:px-10 py-8 items-center justify-between">
            <h1 className="text-3xl font-bold">{name}</h1>
            <div className="flex gap-6 flex-col sm:flex-row">
              <WatchlistButton
                watchlist={{
                  id: id,
                  poster_path: poster_path,
                  name: name,
                  media_type: media_type || "movie",
                  description: description
                }}
              />
              <ShareButton />
            </div>
          </div>
          <div className="p-5 lg:px-10 pt-3 mb-15">
            <h2 className="text-2xl text-pink-600">Description</h2> <br />
            <p className="text-xl">{description}</p>
          </div>
        </>
      ) : (
        <div className="w-full h-[60vh] flex flex-col gap-4 items-center justify-center text-slate-400">
          <FilmIcon className="w-25 h-25" />
          <p>Uh Oh! Video is unavailable.</p>
          <Link href={"/"} className={buttonVariants()}>
            Take me Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default page;

