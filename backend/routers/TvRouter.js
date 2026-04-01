const express = require("express");

const {
    getMysteryTvShows,
    getActionTvShows,
    getComedyTvShows,
    getCrimeTvShows,
    getDramaTvShows,
} = require("../controllers/TvController");

const TvRouter = express.Router();

TvRouter.get("/mystery", getMysteryTvShows);
TvRouter.get("/action", getActionTvShows);
TvRouter.get("/comedy", getComedyTvShows);
TvRouter.get("/crime", getCrimeTvShows);
TvRouter.get("/drama", getDramaTvShows);

module.exports = TvRouter;