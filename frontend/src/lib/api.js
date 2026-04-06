import axios from "axios";

export const ENDPOINT = {
  login: "/auth/login",
  signup: "/auth/signup",
  user: "/user",
  logout: "/auth/logout",
  forgetpassword: "/auth/forgetpassword",
  resetPassword: "/auth/resetPassword",
  payment: "/payment/order",
  updatePremium: "/payment/update-premium-access",

  addToWishlist: "/user/wishlist",
  getWishlist: "/user/wishlist",

  discoverNowPlaying: "/discover/now-playing", // Banner
  discoverTrending: "/discover/trending",
  discoverTopRated: "/discover/top-rated",
  discoverUpcoming: "/discover/upcoming",

  fetchAnimeMovies: `/movies/anime`, // Banner
  fetchActionMovies: `/movies/action`,
  fetchComedyMovies: `/movies/comedy`,
  fetchHorrorMovies: `/movies/horror`,
  fetchRomanceMovies: `/movies/romance`,

  getMovieDetails: (id) => `/movies/details?id=${id}`,
  
  fetchMysteryTvShows: `/tv/mystery`, // Banner
  fetchActionTvShows: `/tv/action`,
  fetchComedyTvShows: `/tv/comedy`,
  fetchCrimeTvShows: `/tv/crime`,
  fetchDramaTvShows: `/tv/drama`,
  
  getTvShowsDetails: (id) => `/tv/details?id=${id}`,

  fetchAllStreamingVideos: `/video`,
  fetchStreamingVideo: (id) => `/video?id=${id}`,
  fetchVideoThumbnail: (id) => `/video/thumbnail?videoId=${id}`,
};

export const API_BASE_URL = "http://localhost:3000/api/"                 // process.env.NEXT_PUBLIC_API_BASE_URL;

export const media = (path) => `https://image.tmdb.org/t/p/original` + path;

export const getStreamingVideoThumbnail = (id) =>
  API_BASE_URL + ENDPOINT.fetchVideoThumbnail(id);

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});


// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;

    // 1. Check if we should retry
    // We only retry if the request exists and we haven't hit the limit (e.g., 3 tries)
    if (!config || !config.retryCount) {
      config.retryCount = 0;
    }

    if (config.retryCount < 2) { // This will allow 3 total attempts
      config.retryCount += 1;
      console.warn(`Retrying request... Attempt ${config.retryCount}`);
      
      // Optional: Add a small delay (e.g., 500ms) before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return api(config); // Re-run the exact same request
    }

    // 2. If all retries fail, log and reject as you did before
    console.error("API Error (All retries failed):", {
      status: error.response?.status,
      message: error.message,
    });

    return Promise.reject(error);
  }
);


export function getWatchUrl(vidId, mediaType) {
  const prefix = mediaType === "tv" ? "tv" : "movies";
  return `${prefix}/watch?id=${vidId}`;
}
