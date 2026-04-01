const express = require("express");
const { protectRouteMiddleWare } = require("../controllers/AuthController");
const { addToWishlist, getUserWishlist, getCurrentUser } = require("../controllers/UserController");

const UserRouter = express.Router();

UserRouter.use(protectRouteMiddleWare);
UserRouter.get("/wishlist", getUserWishlist);
UserRouter.get("/",getCurrentUser);
UserRouter.post("/wishlist", addToWishlist);


module.exports = UserRouter;



