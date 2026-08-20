const mongoose = require("mongoose");
const CommentModel = require("../models/CommentModel");

function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

function authorDisplayName(user) {
    return user?.name || user?.email || "User";
}

function handleCommentError(res, err, fallbackMessage) {
    console.error(fallbackMessage, err);
    if (err.name === "CastError") {
        return res.status(400).json({
            status: "failure",
            message: "Invalid comment id"
        });
    }
    return res.status(500).json({
        status: "failure",
        message: fallbackMessage
    });
}

// Get paginated comments for a video
async function getComments(req, res) {
    try {
        const movieId = String(req.query.movieId || "").trim();
        if (!movieId) {
            return res.status(400).json({
                status: "failure",
                message: "movieId is required"
            });
        }

        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 5, 1), 50);
        const skip = (page - 1) * limit;

        const totalComments = await CommentModel.countDocuments({ movieId });
        
        const comments = await CommentModel.find({ movieId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("author", "name")
            .populate("replies.author", "name");

        const hasMore = totalComments > (page * limit);

        res.status(200).json({
            status: "success",
            comments,
            hasMore,
            totalComments
        });
    } catch (err) {
        return handleCommentError(res, err, "Failed to fetch comments");
    }
}

// Add a new comment
async function addComment(req, res) {
    try {
        const movieId = req.body.movieId || req.query.movieId;
        const { text } = req.body;

        if (!movieId || String(movieId).trim() === "") {
            return res.status(400).json({
                status: "failure",
                message: "movieId is required"
            });
        }

        if (!text || text.trim() === "") {
            return res.status(400).json({
                status: "failure",
                message: "Comment text cannot be empty"
            });
        }

        const newComment = await CommentModel.create({
            movieId: String(movieId),
            author: req.user._id,
            authorName: authorDisplayName(req.user),
            text: text.trim()
        });

        // Populate author and return
        const populatedComment = await CommentModel.findById(newComment._id)
            .populate("author", "name");

        res.status(201).json({
            status: "success",
            comment: populatedComment
        });
    } catch (err) {
        return handleCommentError(res, err, "Failed to add comment");
    }
}

// Add a reply to a comment
async function addReply(req, res) {
    try {
        const { commentId } = req.params;
        const { text } = req.body;

        if (!isValidObjectId(commentId)) {
            return res.status(400).json({
                status: "failure",
                message: "Invalid comment id"
            });
        }

        if (!text || text.trim() === "") {
            return res.status(400).json({
                status: "failure",
                message: "Reply text cannot be empty"
            });
        }

        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                status: "failure",
                message: "Comment not found"
            });
        }

        comment.replies.push({
            author: req.user._id,
            authorName: authorDisplayName(req.user),
            text: text.trim(),
            likes: [],
            dislikes: []
        });

        await comment.save();

        const updatedComment = await CommentModel.findById(commentId)
            .populate("author", "name")
            .populate("replies.author", "name");

        res.status(200).json({
            status: "success",
            comment: updatedComment
        });
    } catch (err) {
        return handleCommentError(res, err, "Failed to add reply");
    }
}

// Toggle like on a comment/reply
async function toggleLike(req, res) {
    try {
        const { commentId } = req.params;
        const { replyId } = req.body;
        const userId = req.user._id;

        if (!isValidObjectId(commentId) || (replyId && !isValidObjectId(replyId))) {
            return res.status(400).json({
                status: "failure",
                message: "Invalid comment id"
            });
        }

        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                status: "failure",
                message: "Comment not found"
            });
        }

        const userIdStr = userId.toString();

        if (replyId) {
            // Toggle like on a nested reply
            const reply = comment.replies.id(replyId);
            if (!reply) {
                return res.status(404).json({
                    status: "failure",
                    message: "Reply not found"
                });
            }

            const likeIndex = reply.likes.findIndex(id => id.toString() === userIdStr);
            const dislikeIndex = reply.dislikes.findIndex(id => id.toString() === userIdStr);

            if (likeIndex > -1) {
                // Already liked, so unlike
                reply.likes.splice(likeIndex, 1);
            } else {
                // Like reply, remove dislike
                reply.likes.push(userId);
                if (dislikeIndex > -1) {
                    reply.dislikes.splice(dislikeIndex, 1);
                }
            }
        } else {
            // Toggle like on the comment itself
            const likeIndex = comment.likes.findIndex(id => id.toString() === userIdStr);
            const dislikeIndex = comment.dislikes.findIndex(id => id.toString() === userIdStr);

            if (likeIndex > -1) {
                // Already liked, so unlike
                comment.likes.splice(likeIndex, 1);
            } else {
                // Like comment, remove dislike
                comment.likes.push(userId);
                if (dislikeIndex > -1) {
                    comment.dislikes.splice(dislikeIndex, 1);
                }
            }
        }

        await comment.save();

        const updatedComment = await CommentModel.findById(commentId)
            .populate("author", "name")
            .populate("replies.author", "name");

        res.status(200).json({
            status: "success",
            comment: updatedComment
        });
    } catch (err) {
        return handleCommentError(res, err, "Failed to handle like action");
    }
}

// Toggle dislike on a comment/reply
async function toggleDislike(req, res) {
    try {
        const { commentId } = req.params;
        const { replyId } = req.body;
        const userId = req.user._id;

        if (!isValidObjectId(commentId) || (replyId && !isValidObjectId(replyId))) {
            return res.status(400).json({
                status: "failure",
                message: "Invalid comment id"
            });
        }

        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                status: "failure",
                message: "Comment not found"
            });
        }

        const userIdStr = userId.toString();

        if (replyId) {
            // Toggle dislike on a nested reply
            const reply = comment.replies.id(replyId);
            if (!reply) {
                return res.status(404).json({
                    status: "failure",
                    message: "Reply not found"
                });
            }

            const likeIndex = reply.likes.findIndex(id => id.toString() === userIdStr);
            const dislikeIndex = reply.dislikes.findIndex(id => id.toString() === userIdStr);

            if (dislikeIndex > -1) {
                // Already disliked, so undislike
                reply.dislikes.splice(dislikeIndex, 1);
            } else {
                // Dislike reply, remove like
                reply.dislikes.push(userId);
                if (likeIndex > -1) {
                    reply.likes.splice(likeIndex, 1);
                }
            }
        } else {
            // Toggle dislike on the comment itself
            const likeIndex = comment.likes.findIndex(id => id.toString() === userIdStr);
            const dislikeIndex = comment.dislikes.findIndex(id => id.toString() === userIdStr);

            if (dislikeIndex > -1) {
                // Already disliked, so undislike
                comment.dislikes.splice(dislikeIndex, 1);
            } else {
                // Dislike comment, remove like
                comment.dislikes.push(userId);
                if (likeIndex > -1) {
                    comment.likes.splice(likeIndex, 1);
                }
            }
        }

        await comment.save();

        const updatedComment = await CommentModel.findById(commentId)
            .populate("author", "name")
            .populate("replies.author", "name");

        res.status(200).json({
            status: "success",
            comment: updatedComment
        });
    } catch (err) {
        return handleCommentError(res, err, "Failed to handle dislike action");
    }
}

function authorIdOf(doc) {
    if (!doc?.author) return "";
    return (doc.author._id || doc.author).toString();
}

async function deleteComment(req, res) {
    try {
        const { commentId } = req.params;
        const replyId = req.body?.replyId || req.query.replyId;

        if (!isValidObjectId(commentId) || (replyId && !isValidObjectId(replyId))) {
            return res.status(400).json({
                status: "failure",
                message: "Invalid comment id"
            });
        }

        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                status: "failure",
                message: "Comment not found"
            });
        }

        const userIdStr = req.user._id.toString();

        if (replyId) {
            const reply = comment.replies.id(replyId);
            if (!reply) {
                return res.status(404).json({
                    status: "failure",
                    message: "Reply not found"
                });
            }

            if (authorIdOf(reply) !== userIdStr) {
                return res.status(403).json({
                    status: "failure",
                    message: "You can only delete your own replies"
                });
            }

            reply.deleteOne();
            await comment.save();

            const updatedComment = await CommentModel.findById(commentId)
                .populate("author", "name")
                .populate("replies.author", "name");

            return res.status(200).json({
                status: "success",
                comment: updatedComment
            });
        }

        if (authorIdOf(comment) !== userIdStr) {
            return res.status(403).json({
                status: "failure",
                message: "You can only delete your own comments"
            });
        }

        await CommentModel.findByIdAndDelete(commentId);

        return res.status(200).json({
            status: "success",
            deletedId: commentId
        });
    } catch (err) {
        return handleCommentError(res, err, "Failed to delete comment");
    }
}

module.exports = {
    getComments,
    addComment,
    addReply,
    toggleLike,
    toggleDislike,
    deleteComment
};
