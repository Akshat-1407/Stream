const express = require("express");
const { protectRouteMiddleware } = require("../controllers/AuthController");
const { addToWishlist, getUserWishlist, getCurrentUser } = require("../controllers/UserController");

const UserRouter = express.Router();

UserRouter.use(protectRouteMiddleware);
UserRouter.get("/watchlist", getUserWishlist);
UserRouter.get("/",getCurrentUser);
UserRouter.post("/watchlist", addToWishlist);


module.exports = UserRouter;



