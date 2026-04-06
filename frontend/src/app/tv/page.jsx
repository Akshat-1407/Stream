import ListingSection from "../../components/sections/ListingSection";
import { api, ENDPOINT } from "../../lib/api";

export default function Tv() {
  
  const list = [
    {
      label: "Action",
      href: "action",
      fetcher: async () => {
        return (await api.get(ENDPOINT.fetchActionTvShows)).data?.response?.results;
      },
    },
    {
      label: "Comedy",
      href: "comedy",
      fetcher: async () => {
        return (await api.get(ENDPOINT.fetchComedyTvShows)).data?.response?.results;
      },
    },
    {
      label: "Crime",
      href: "crime",
      fetcher: async () => {
        return (await api.get(ENDPOINT.fetchCrimeTvShows)).data?.response?.results;
      },
    },
    {
      label: "Drama",
      href: "drama",
      fetcher: async () => {
        return (await api.get(ENDPOINT.fetchDramaTvShows)).data?.response?.results;
      },
    },
  ];


  const getBannerData = async () => {
    return (await api.get(ENDPOINT.fetchMysteryTvShows)).data?.response?.results;
  };

  return <main>
    <ListingSection bannerData={getBannerData} categoryList={list} />
  </main>
}

// export default function Tv() {
//   return <div>Tv</div>
// }
