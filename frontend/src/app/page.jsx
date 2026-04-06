
import ListingSection from "../components/sections/ListingSection";
import { api, ENDPOINT } from "../lib/api";

export default function Home() {
  const list = [
    {
      label: "Top Rated",
      href: "top-rated",
      fetcher: async () => {
        return (await api.get(ENDPOINT.discoverTopRated)).data?.response?.results;
      },
    },
    {
      label: "Popular",
      href: "popular",
      fetcher: async () => {
        return (await api.get(ENDPOINT.discoverTrending)).data?.response?.results;
      },
    },
    {
      label: "Upcoming",
      href: "upcoming",
      fetcher: async () => {
        return (await api.get(ENDPOINT.discoverUpcoming)).data?.response?.results;
      },
    },
  ];


  const getBannerData = async () => {
    return (await api.get(ENDPOINT.discoverNowPlaying)).data?.response?.results;
  };


  return <main>
    <ListingSection bannerData={getBannerData} categoryList={list} />
  </main>

}
