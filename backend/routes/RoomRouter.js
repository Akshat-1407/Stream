const express = require("express");
const { protectRouteMiddleware } = require("../controllers/AuthController");
const { createRoom, getRoomDetails } = require("../controllers/RoomController");

const RoomRouter = express.Router();

RoomRouter.use(protectRouteMiddleware);

RoomRouter.post("/", createRoom);
RoomRouter.get("/:roomId", getRoomDetails);

module.exports = RoomRouter;
