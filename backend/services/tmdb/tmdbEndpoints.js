const TMDB_ENDPOINT = {

  // Home Page
  fetchNowPlaying: "/movie/now_playing", // Banner
  fetchTrending: `/trending/all/week`,
  fetchUpcoming: `/movie/upcoming?include_video=true`,
  fetchTopRated: `/movie/top_rated?include_video=true`,

  // Movies
  fetchAnimeMovies: '/discover/movie?language=en-US&with_genres=16', // Banner
  fetchActionMovies: `/discover/movie?language=en-US&with_genres=28`,
  fetchComedyMovies: `/discover/movie?language=en-US&with_genres=35`,
  fetchHorrorMovies: `/discover/movie?language=en-US&with_genres=27`,
  fetchRomanceMovies: `/discover/movie?language=en-US&with_genres=10749`,
  fetchMovieVideos: (id) => `/movie/${id}/videos`, // Youtube Trailer Route
  fetchMovieDetails: (id) => `/movie/${id}`,  // watchlist

  // TV

  fetchMysteryTvShows: `/discover/tv?language=en-US&with_genres=9648`, // Banner
  fetchActionTvShows: `/discover/tv?language=en-US&with_genres=10759`,
  fetchComedyTvShows: `/discover/tv?language=en-US&with_genres=35`,
  fetchDramaTvShows: `/discover/tv?language=en-US&with_genres=18`,
  fetchCrimeTvShows: `/discover/tv?language=en-US&with_genres=80`,
  fetchTvShowVideos: (id) => `/tv/${id}/videos`, // Youtube Trailer Route
  fetchTvShowDetails: (id) => `/tv/${id}`,  // watchlist
};

module.exports = TMDB_ENDPOINT;