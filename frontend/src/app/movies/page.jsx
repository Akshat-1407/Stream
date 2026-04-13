import ListingSection from "../../components/sections/ListingSection";
import { injectMediaType } from "../../lib/utils";
import { api, ENDPOINT } from "../../lib/api";

export default function Movies() {
  
  const list = [
    {
      label: "Action",
      href: "action",
      fetcher: async () => {
        const data =  (await api.get(ENDPOINT.fetchActionMovies)).data?.response?.results;
        injectMediaType(data, "movies");
        return data;
      },
    },
    {
      label: "Comedy",
      href: "comedy",
      fetcher: async () => {
        const data = (await api.get(ENDPOINT.fetchComedyMovies)).data?.response?.results;
        injectMediaType(data, "movies");
        return data;
      },
    },
    {
      label: "Horror",
      href: "horror",
      fetcher: async () => {
        const data = (await api.get(ENDPOINT.fetchHorrorMovies)).data?.response?.results;
        injectMediaType(data, "movies");
        return data;
      },
    },
    {
      label: "Romance",
      href: "romance",
      fetcher: async () => {
        const data = (await api.get(ENDPOINT.fetchRomanceMovies)).data?.response?.results;
        injectMediaType(data, "movies");
        return data;
      },
    },
  ];


  const getBannerData = async () => {
    const data = (await api.get(ENDPOINT.fetchAnimeMovies)).data?.response?.results;
    injectMediaType(data, "movies");
    return data;
  };

  return <main>
    <ListingSection bannerData={getBannerData} categoryList={list} />
  </main>
}
