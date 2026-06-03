const TMDB_BASE_URL = "https://api.themoviedb.org/3/";

const tmdbApi = {
  get: async (endpoint) => {
    const url = TMDB_BASE_URL + endpoint;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`
      }
    });
    
    const data = await response.json();
    return data;
  }
}

module.exports = tmdbApi;