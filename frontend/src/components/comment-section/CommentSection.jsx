"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MessageCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import useComments from "../../app/stream+/watch/hooks/useComments";
import CommentInputForm from "./CommentInputForm";
import CommentItem from "./CommentItem";
import CommentSkeleton from "./CommentSkeleton";

export default function CommentSection({ movieId }) {
  const { user, isLoggedIn } = useSelector((state) => state.user);
  const {
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
    loadMore,
  } = useComments(movieId);

  const [newCommentText, setNewCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const [submittingReply, setSubmittingReply] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const currentUserId = user?._id ? user._id.toString() : "";

  const requireAuth = (action) => {
    if (!isLoggedIn) {
      toast.error("Please log in to interact with comments.");
      return;
    }
    action();
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || submittingComment) return;

    setSubmittingComment(true);
    const success = await addComment(newCommentText);
    if (success) setNewCommentText("");
    setSubmittingComment(false);
  };

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    const text = replyTexts[commentId] || "";
    if (!text.trim() || submittingReply) return;

    setSubmittingReply(true);
    const success = await addReply(commentId, text);
    if (success) {
      setReplyTexts((prev) => ({ ...prev, [commentId]: "" }));
      setReplyingToId(null);
    }
    setSubmittingReply(false);
  };

  const handleDelete = async (commentId, replyId = null) => {
    const confirmed = window.confirm(
      replyId ? "Delete this reply?" : "Delete this comment and its replies?"
    );
    if (!confirmed) return;

    const key = replyId || commentId;
    setDeletingId(key);
    await deleteComment(commentId, replyId);
    setDeletingId(null);
  };

  return (
    <div className="text-white max-w-4xl mt-6 font-sans">
      {/* Header */}
      <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
        Comments
        {!initialLoading && (
          <span className="text-sm font-normal text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full">
            {totalComments}
          </span>
        )}
      </h3>

      {/* Primary Input */}
      {isLoggedIn ? (
        <div className="mb-8">
          <CommentInputForm
            user={user}
            value={newCommentText}
            onChange={setNewCommentText}
            onSubmit={handleCommentSubmit}
            onCancel={() => setNewCommentText("")}
            isSubmitting={submittingComment}
          />
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4 text-center mb-8 text-slate-400 text-sm">
          Please log in to leave a comment.
        </div>
      )}

      {/* Loading State */}
      {initialLoading && <CommentSkeleton />}

      {/* Empty State */}
      {!initialLoading && comments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-3">
          <MessageCircle className="size-10 opacity-40" />
          <p className="text-sm">No comments yet. Be the first to comment!</p>
        </div>
      )}

      {/* Comments List */}
      {!initialLoading && comments.length > 0 && (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              user={user}
              isLoggedIn={isLoggedIn}
              currentUserId={currentUserId}
              replyingToId={replyingToId}
              replyText={replyTexts[comment._id]}
              submittingReply={submittingReply}
              deletingId={deletingId}
              onLike={(cId, rId) => toggleLike(cId, rId)}
              onDislike={(cId, rId) => toggleDislike(cId, rId)}
              onToggleReply={(cId) =>
                setReplyingToId((prev) => (prev === cId ? null : cId))
              }
              onReplyTextChange={(text) =>
                setReplyTexts((prev) => ({ ...prev, [comment._id]: text }))
              }
              onReplySubmit={handleReplySubmit}
              onDelete={handleDelete}
              requireAuth={requireAuth}
            />
          ))}
        </div>
      )}

      {/* Load More Pagination */}
      {!initialLoading && hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2 bg-[#141414] hover:bg-[#202020] border border-white/10 hover:border-white/20 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin text-rose-500" />
                <span>Loading...</span>
              </>
            ) : (
              <span>Load More Comments</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}