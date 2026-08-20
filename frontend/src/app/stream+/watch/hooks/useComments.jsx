import { useState, useEffect, useCallback, useRef } from "react";
import { api, ENDPOINT } from "@/lib/api";
import { toast } from "sonner";

function isCanceled(err) {
    return err?.code === "ERR_CANCELED" || err?.name === "CanceledError" || err?.name === "AbortError";
}

export default function useComments(movieId) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [totalComments, setTotalComments] = useState(0);
    const [page, setPage] = useState(1);

    const currentMovieId = useRef(movieId);

    const fetchComments = useCallback(async (pageNum, mid, signal) => {
        if (!mid) return;

        try {
            if (pageNum === 1) {
                setInitialLoading(true);
            } else {
                setLoading(true);
            }

            const response = await api.get(ENDPOINT.getComments, {
                params: { movieId: mid, page: pageNum, limit: 5 },
                signal
            });

            if (currentMovieId.current !== mid) return;

            if (response.data?.status === "success") {
                const fetchedComments = response.data.comments || [];
                setComments(prev => pageNum === 1 ? fetchedComments : [...prev, ...fetchedComments]);
                setHasMore(Boolean(response.data.hasMore));
                if (typeof response.data.totalComments === "number") {
                    setTotalComments(response.data.totalComments);
                }
            } else {
                toast.error(response.data?.message || "Failed to load comments.");
            }
        } catch (err) {
            if (isCanceled(err) || currentMovieId.current !== mid) return;
            const status = err.response?.status;
            const msg = err.response?.data?.message;
            console.error(`Error fetching comments [${status}]:`, msg || err.message);
            if (status === 401) {
                toast.error("Please log in to view comments.");
            } else {
                toast.error(msg || "Failed to load comments.");
            }
        } finally {
            if (currentMovieId.current === mid) {
                setInitialLoading(false);
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        currentMovieId.current = movieId;
        setComments([]);
        setPage(1);
        setHasMore(false);
        setTotalComments(0);

        if (!movieId || typeof movieId !== "string" || movieId.trim() === "") {
            return undefined;
        }

        const controller = new AbortController();
        fetchComments(1, movieId, controller.signal);
        return () => controller.abort();
    }, [movieId, fetchComments]);

    const loadMore = useCallback(() => {
        if (loading || !hasMore || !movieId) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchComments(nextPage, movieId);
    }, [page, hasMore, loading, movieId, fetchComments]);

    const addComment = useCallback(async (text) => {
        if (!movieId || !text.trim()) return false;

        try {
            const response = await api.post(ENDPOINT.addComment, {
                movieId,
                text: text.trim()
            });
            if (response.data?.status === "success") {
                setComments(prev => [response.data.comment, ...prev]);
                setTotalComments(prev => prev + 1);
                toast.success("Comment posted successfully!");
                return true;
            }
            toast.error(response.data?.message || "Failed to post comment.");
            return false;
        } catch (err) {
            const status = err.response?.status;
            const msg = err.response?.data?.message;
            console.error(`Error adding comment [${status}]:`, msg || err.message);
            toast.error(status === 401 ? "Please log in to comment." : (msg || "Failed to post comment."));
            return false;
        }
    }, [movieId]);

    const addReply = useCallback(async (commentId, text) => {
        if (!commentId || !text.trim()) return false;

        try {
            const response = await api.post(ENDPOINT.addReply(commentId), { text: text.trim() });
            if (response.data?.status === "success") {
                setComments(prev => prev.map(c => c._id === commentId ? response.data.comment : c));
                toast.success("Reply posted successfully!");
                return true;
            }
            toast.error(response.data?.message || "Failed to post reply.");
            return false;
        } catch (err) {
            const status = err.response?.status;
            const msg = err.response?.data?.message;
            console.error(`Error adding reply [${status}]:`, msg || err.message);
            toast.error(status === 401 ? "Please log in to reply." : (msg || "Failed to post reply."));
            return false;
        }
    }, []);

    const toggleLike = useCallback(async (commentId, replyId = null) => {
        if (!commentId) return;

        try {
            const body = replyId ? { replyId } : {};
            const response = await api.post(ENDPOINT.likeComment(commentId), body);
            if (response.data?.status === "success") {
                setComments(prev => prev.map(c => c._id === commentId ? response.data.comment : c));
            }
        } catch (err) {
            const status = err.response?.status;
            console.error(`Error toggling like [${status}]:`, err.response?.data?.message || err.message);
            toast.error(status === 401 ? "Please log in to like comments." : "Failed to update like.");
        }
    }, []);

    const deleteComment = useCallback(async (commentId, replyId = null) => {
        if (!commentId) return false;

        try {
            const body = replyId ? { replyId } : {};
            const response = await api.delete(ENDPOINT.deleteComment(commentId), {
                data: body,
                params: replyId ? { replyId } : undefined
            });
            if (response.data?.status === "success") {
                if (replyId) {
                    setComments(prev => prev.map(c => c._id === commentId ? response.data.comment : c));
                    toast.success("Reply deleted.");
                } else {
                    setComments(prev => prev.filter(c => c._id !== commentId));
                    setTotalComments(prev => Math.max(prev - 1, 0));
                    toast.success("Comment deleted.");
                }
                return true;
            }
            toast.error(response.data?.message || "Failed to delete.");
            return false;
        } catch (err) {
            const status = err.response?.status;
            const msg = err.response?.data?.message;
            console.error(`Error deleting comment [${status}]:`, msg || err.message);
            if (status === 401) {
                toast.error("Please log in to delete comments.");
            } else if (status === 403) {
                toast.error(msg || "You can only delete your own comments.");
            } else {
                toast.error(msg || "Failed to delete.");
            }
            return false;
        }
    }, []);

    const toggleDislike = useCallback(async (commentId, replyId = null) => {
        if (!commentId) return;

        try {
            const body = replyId ? { replyId } : {};
            const response = await api.post(ENDPOINT.dislikeComment(commentId), body);
            if (response.data?.status === "success") {
                setComments(prev => prev.map(c => c._id === commentId ? response.data.comment : c));
            }
        } catch (err) {
            const status = err.response?.status;
            console.error(`Error toggling dislike [${status}]:`, err.response?.data?.message || err.message);
            toast.error(status === 401 ? "Please log in to dislike comments." : "Failed to update dislike.");
        }
    }, []);

    return {
        comments,
        loading,
        initialLoading,
        hasMore,
        totalComments,
        addComment,
        addReply,
        toggleLike,
        toggleDislike,
        deleteComment,
        loadMore
    };
}
