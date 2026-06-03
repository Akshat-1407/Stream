const express = require('express');

const {
    getActionMovies,
    getAnimeMovies,
    getRomanceMovies,
    getHorrorMovies,
    getComedyMovies,
    getMovieDetails
} = require("../controllers/MoviesController");

const MovieRouter = express.Router();

MovieRouter.get("/anime", getAnimeMovies);
MovieRouter.get("/action", getActionMovies);
MovieRouter.get("/comedy", getComedyMovies);
MovieRouter.get("/horror", getHorrorMovies);
MovieRouter.get("/romance", getRomanceMovies);
MovieRouter.get("/details", getMovieDetails);


module.exports = MovieRouter;