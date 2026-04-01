export const ENDPOINT = {
    // auth
    login: "/auth/login",
    signup: "/auth/signup",
    user: "/user",
    logout: "/auth/logout",
    forgetpassword: "/auth/forgetpassword",
    resetPassword: "/auth/resetPassword",

    //discover => home
    discoverNowPlaying: "/discover/now-playing",

    discoverTrending: "/discover/trending",
    discoverTopRated: "/discover/top-rated",
    discoverUpcoming: "/discover/upcoming",

    // movies
    fetchAnimeMovies: `/movies/anime`,

    fetchActionMovies: `/movies/action`,
    fetchComedyMovies: `/movies/comedy`,
    fetchHorrorMovies: `/movies/horror`,
    fetchRomanceMovies: `/movies/romance`,

    //tv shows
    fetchMysteryTvShows: `/tv/mystery`,
    
    fetchActionTvShows: `/tv/action`,
    fetchComedyTvShows: `/tv/comedy`,
    fetchCrimeTvShows: `/tv/crime`,
    fetchDramaTvShows: `/tv/drama`,

    //extra data 
    getMovieDetails: (id) => `/movies/details?id=${id}`,
    getTvShowsDetails: (id) => `/tv/details?id=${id}`,

    //user
    // user: "/user",
    // addToWishlist: "/user/wishlist",
    // getWishlist: "/user/wishlist",

    //payment
    // payment: "/payment/order",
    // updatePremium: "/payment/update-premium-access",

    // streaming urls
    // fetchAllStreamingVideos: `/video`,
    // fetchStreamingVideo: (id) => `/video?id=${id}`,
    // fetchVideoThumbnail: (id) => `/video/thumbnail?videoId=${id}`,
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;