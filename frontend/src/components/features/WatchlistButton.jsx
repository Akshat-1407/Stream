"use client"

import { Button } from "../ui/button";
import { useState } from "react";
import { LoaderCircle, PlusIcon } from 'lucide-react';
import { ENDPOINT, api } from "../../lib/api"
import { useSelector } from "react-redux";
import { toast } from "sonner";

function WatchlistButton({ watchlist }) {

  const [loading, setLoading] = useState(false);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn)

  async function addToWatchlist() {
    try {
      setLoading(true);
      const res = await api.post(ENDPOINT.addToWishlist, watchlist);

      if (res.status == 200) {
        toast(res?.data?.message);
      }

    } catch (err) {

      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      toast.error(errorMessage);

    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {isLoggedIn ? (
        <Button
          onClick={addToWatchlist}
          className={`bg-rose-500 hover:bg-rose-600 text-white cursor-pointer flex items-center p-4 pr-5 ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          {loading ? (
            <LoaderCircle data-testid="loading-icon" className="w-4 h-4 mr-2" />
          ) : (
            <PlusIcon className="text-white flex items-center size-4" />
          )}
          <p className="mt-0.5">Watchlist</p>
        </Button>
      ) : (
        null
      )}
    </div>
  )
}

export default WatchlistButton