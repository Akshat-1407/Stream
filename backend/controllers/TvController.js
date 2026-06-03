const tmdbApi = require("../services/tmdb/tmdb");
const TMDB_ENDPOINT = require("../services/tmdb/tmdbEndpoints");

const getMysteryTvShows = async (req, res) => {
    try {
        const data = await tmdbApi.get(TMDB_ENDPOINT.fetchMysteryTvShows);

        res.status(200).json({
            status: "success",
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
        const data = await tmdbApi.get(TMDB_ENDPOINT.fetchActionTvShows);

        res.status(200).json({
            status: "success",
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
        const data = await tmdbApi.get(TMDB_ENDPOINT.fetchComedyTvShows);

        res.status(200).json({
            status: "success",
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
        const data = await tmdbApi.get(TMDB_ENDPOINT.fetchCrimeTvShows);

        res.status(200).json({
            status: "success",
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
        const data = await tmdbApi.get(TMDB_ENDPOINT.fetchDramaTvShows);

        res.status(200).json({
            status: "success",
            response: data, 
        });
    } catch(err) {
        res.status(500).json({
            status: "failure",
            message: err.message,
        });
    }
}

const getTvShowDetails = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) throw new Error("Video Id is not defined.");
        
        const data = await tmdbApi.get(TMDB_ENDPOINT.fetchTvShowVideos(id));

        res.status(200).json({
            status: "success",
            response: data
        })
    } catch (err) {
        res.status(500).json({
            status: "failure",
            response: err.message,
        })
    }
}

module.exports = {
    getMysteryTvShows,
    getActionTvShows,
    getComedyTvShows,
    getCrimeTvShows,
    getDramaTvShows,
    getTvShowDetails,
}