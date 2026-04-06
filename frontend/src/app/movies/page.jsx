import ListingSection from "../../components/sections/ListingSection";
import { api, ENDPOINT } from "../../lib/api";

export default function Movies() {
  
  const list = [
    {
      label: "Action",
      href: "action",
      fetcher: async () => {
        return (await api.get(ENDPOINT.fetchActionMovies)).data?.response?.results;
      },
    },
    {
      label: "Comedy",
      href: "comedy",
      fetcher: async () => {
        return (await api.get(ENDPOINT.fetchComedyMovies)).data?.response?.results;
      },
    },
    {
      label: "Horror",
      href: "horror",
      fetcher: async () => {
        return (await api.get(ENDPOINT.fetchHorrorMovies)).data?.response?.results;
      },
    },
    {
      label: "Romance",
      href: "romance",
      fetcher: async () => {
        return (await api.get(ENDPOINT.fetchRomanceMovies)).data?.response?.results;
      },
    },
  ];


  const getBannerData = async () => {
    return (await api.get(ENDPOINT.fetchAnimeMovies)).data?.response?.results;
  };

  return <main>
    <ListingSection bannerData={getBannerData} categoryList={list} />
  </main>
}
