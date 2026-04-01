const { TMDB_ENDPOINT, tmdbApi } = require("../utility/tmdb");

const getMysteryTvShows = async (req, res) => {
    try {
        const data = tmdbApi.get(TMDB_ENDPOINT.fetchMysteryTvShows);

        res.status(200).json({
            status: "sucess",
            response: data, 
        });
    } catch(err) {
        res.status(500).json({
            status: "failure",
            message: err.message,
        });
    }
}

const getActionTvShows = async (req, res) => {
    try {
        const data = tmdbApi.get(TMDB_ENDPOINT.fetchActionTvShows);

        res.status(200).json({
            status: "sucess",
            response: data, 
        });
    } catch(err) {
        res.status(500).json({
            status: "failure",
            message: err.message,
        });
    }
}
const getComedyTvShows = async (req, res) => {
    try {
        const data = tmdbApi.get(TMDB_ENDPOINT.fetchComedyTvShows);

        res.status(200).json({
            status: "sucess",
            response: data, 
        });
    } catch(err) {
        res.status(500).json({
            status: "failure",
            message: err.message,
        });
    }
}
const getCrimeTvShows = async (req, res) => {
    try {
        const data = tmdbApi.get(TMDB_ENDPOINT.fetchCrimeTvShows);

        res.status(200).json({
            status: "sucess",
            response: data, 
        });
    } catch(err) {
        res.status(500).json({
            status: "failure",
            message: err.message,
        });
    }
}
const getDramaTvShows = async (req, res) => {
    try {
        const data = tmdbApi.get(TMDB_ENDPOINT.fetchDramaTvShows);

        res.status(200).json({
            status: "sucess",
            response: data, 
        });
    } catch(err) {
        res.status(500).json({
            status: "failure",
            message: err.message,
        });
    }
}

module.exports = {
    getMysteryTvShows,
    getActionTvShows,
    getComedyTvShows,
    getCrimeTvShows,
    getDramaTvShows,
}