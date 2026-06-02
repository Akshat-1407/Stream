
import ListingSection from "../components/sections/ListingSection";
import { api, ENDPOINT } from "../lib/api";
import { injectMediaType } from "../lib/utils";

export default function Home() {
  const list = [
    {
      label: "Top Rated",
      href: "top-rated",
      fetcher: async () => {
        const data = (await api.get(ENDPOINT.discoverTopRated)).data?.response?.results;
        injectMediaType(data, "movies");
        return data;
      },
    },
    {
      label: "Popular",
      href: "popular",
      fetcher: async () => {
        const data = (await api.get(ENDPOINT.discoverTrending)).data?.response?.results;
        injectMediaType(data, "movies");
        return data;
      },
    },
    {
      label: "Upcoming",
      href: "upcoming",
      fetcher: async () => {
        const data = (await api.get(ENDPOINT.discoverUpcoming)).data?.response?.results;
        injectMediaType(data, "movies");
        return data;
      },
    },
  ];


  const getBannerData = async () => {
    const data = (await api.get(ENDPOINT.discoverNowPlaying)).data?.response?.results;
    injectMediaType(data, "movies");
    return data;
  };


  return <main>
    <ListingSection bannerData={getBannerData} categoryList={list} />
  </main>

}
