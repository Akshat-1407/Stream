const { TMDB_ENDPOINT, tmdbApi } = require("../utility/tmdb");

const getAnimeMovies = async (req, res) => {
    try {
        const data = await tmdbApi.get(TMDB_ENDPOINT.fetchAnimeMovies);
        
        res.status(200).json({
            status: "success",
            response: data
        });
    } catch (err) {
        res.status(500).json({
            status: "failure",
            message: err.message,
        });
    }
}
const getActionMovies = async (req, res) => {
    try {
        const data = await tmdbApi.get(TMDB_ENDPOINT.fetchActionMovies);
        
        res.status(200).json({
            status: "success",
            response: data
        });
    } catch (err) {
        res.status(500).json({
            status: "failure",
            message: err.message,
        });
    }
}
const getComedyMovies = async (req, res) => {
    try {
        const data = await tmdbApi.get(TMDB_ENDPOINT.fetchComedyMovies);
        
        res.status(200).json({
            status: "success",
            response: data
        });
    } catch (err) {
        res.status(500).json({
            status: "failure",
            message: err.message,
        });
    }
}
const getHorrorMovies = async (req, res) => {
    try {
        const data = await tmdbApi.get(TMDB_ENDPOINT.fetchHorrorMovies);
        
        res.status(200).json({
            status: "success",
            response: data
        });
    } catch (err) {
        res.status(500).json({
            status: "failure",
            message: err.message,
        });
    }
}
const getRomanceMovies = async (req, res) => {
    try {
        const data = await tmdbApi.get(TMDB_ENDPOINT.fetchRomanceMovies);
        
        res.status(200).json({
            status: "success",
            response: data
        });
    } catch (err) {
        res.status(500).json({
            status: "failure",
            message: err.message,
        });
    }
}

module.exports = {
    getActionMovies,
    getAnimeMovies,
    getRomanceMovies,
    getHorrorMovies,
    getComedyMovies
}