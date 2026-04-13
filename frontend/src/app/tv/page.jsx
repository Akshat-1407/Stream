import ListingSection from "../../components/sections/ListingSection";
import { injectMediaType } from "../../lib/utils";
import { api, ENDPOINT } from "../../lib/api";

export default function Tv() {
  
  const list = [
    {
      label: "Action",
      href: "action",
      fetcher: async () => {
        const data = (await api.get(ENDPOINT.fetchActionTvShows)).data?.response?.results;
        injectMediaType(data, "tv");
        return data;
      },
    },
    {
      label: "Comedy",
      href: "comedy",
      fetcher: async () => {
        const data = (await api.get(ENDPOINT.fetchComedyTvShows)).data?.response?.results;
        injectMediaType(data, "tv");
        return data;
      },
    },
    {
      label: "Crime",
      href: "crime",
      fetcher: async () => {
        const data = (await api.get(ENDPOINT.fetchCrimeTvShows)).data?.response?.results;
        injectMediaType(data, "tv");
        return data;
      },
    },
    {
      label: "Drama",
      href: "drama",
      fetcher: async () => {
        const data = (await api.get(ENDPOINT.fetchDramaTvShows)).data?.response?.results;
        injectMediaType(data, "tv");
        return data;
      },
    },
  ];


  const getBannerData = async () => {
    const data = (await api.get(ENDPOINT.fetchMysteryTvShows)).data?.response?.results;
    injectMediaType(data, "tv");
    return data;
  };

  return <main>
    <ListingSection bannerData={getBannerData} categoryList={list} />
  </main>
}
