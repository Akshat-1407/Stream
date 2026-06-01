const express = require("express");
const { getVideoStream, getAllVideos, getThumbnail } = require("../controllers/VideoController.js");

const VideoRouter = express.Router();

VideoRouter.get("/", getAllVideos);
VideoRouter.get("/watch", getVideoStream);
VideoRouter.get("/thumbnail", getThumbnail);

module.exports = VideoRouter;