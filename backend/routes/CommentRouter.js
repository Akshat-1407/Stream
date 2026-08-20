const express = require("express");
const { protectRouteMiddleware } = require("../controllers/AuthController");
const {
    getComments,
    addComment,
    addReply,
    toggleLike,
    toggleDislike,
    deleteComment
} = require("../controllers/CommentController");

const CommentRouter = express.Router();

// movieId can contain slashes (e.g. "action/movie_name"), so it must not be a path segment
CommentRouter.get("/", getComments);
CommentRouter.post("/", protectRouteMiddleware, addComment);

CommentRouter.post("/:commentId/reply", protectRouteMiddleware, addReply);
CommentRouter.post("/:commentId/like", protectRouteMiddleware, toggleLike);
CommentRouter.post("/:commentId/dislike", protectRouteMiddleware, toggleDislike);
CommentRouter.delete("/:commentId", protectRouteMiddleware, deleteComment);

module.exports = CommentRouter;
