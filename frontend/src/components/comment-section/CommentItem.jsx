import React from "react";
import { ThumbsUp, ThumbsDown, MessageSquare, Loader2, Trash2 } from "lucide-react";
import Avatar from "./Avatar";
import CommentInputForm from "./CommentInputForm";
import { formatRelativeTime } from "./utils/commentHelpers";

export default function CommentItem({
  comment,
  user,
  isLoggedIn,
  currentUserId,
  replyingToId,
  replyText,
  submittingReply,
  deletingId,
  onLike,
  onDislike,
  onToggleReply,
  onReplyTextChange,
  onReplySubmit,
  onDelete,
  requireAuth,
  isReply = false,
}) {
  const authorName = comment.author?.name || comment.authorName || "Unknown";

  const idEqualsUser = (id) => {
    if (!currentUserId || id == null) return false;
    const value = typeof id === "object" ? id._id || id : id;
    return value.toString() === currentUserId;
  };

  const isLiked = comment.likes?.some(idEqualsUser) || false;
  const isDisliked = comment.dislikes?.some(idEqualsUser) || false;
  const isAuthor = (() => {
    if (!currentUserId || !comment.author) return false;
    const value = typeof comment.author === "object" ? comment.author._id || comment.author : comment.author;
    return value.toString() === currentUserId;
  })();

  const iconSize = isReply ? "size-3" : "size-4";

  return (
    <div className={`flex gap-3 md:gap-4 items-start ${isReply ? "" : "border-b border-white/5 pb-6 last:border-0"}`}>
      <Avatar name={authorName} size={isReply ? "sm" : "md"} />
      
      <div className="flex-1 min-w-0">
        {/* Author Info */}
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-semibold text-white ${isReply ? "text-xs" : "text-sm"}`}>{authorName}</span>
          <span className={`${isReply ? "text-[10px]" : "text-xs"} text-slate-500`}>
            {formatRelativeTime(comment.createdAt)}
          </span>
        </div>

        {/* Content */}
        <p className={`text-slate-300 leading-relaxed mb-2 md:mb-3 wrap-break-word ${isReply ? "text-xs" : "text-sm"}`}>
          {comment.text}
        </p>

        {/* Action Controls */}
        <div className={`flex items-center gap-4 text-slate-400 ${isReply ? "text-[10px]" : "text-xs"}`}>
          <button
            onClick={() => requireAuth(() => onLike(comment._id))}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer hover:text-white ${isLiked ? "text-rose-500" : ""}`}
          >
            <ThumbsUp className={iconSize} fill={isLiked ? "currentColor" : "none"} strokeWidth={isLiked ? 0 : 1.5} />
            <span>{comment.likes?.length || 0}</span>
          </button>

          <button
            onClick={() => requireAuth(() => onDislike(comment._id))}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer hover:text-white ${isDisliked ? "text-slate-200" : ""}`}
          >
            <ThumbsDown className={iconSize} fill={isDisliked ? "currentColor" : "none"} strokeWidth={isDisliked ? 0 : 1.5} />
            <span>{comment.dislikes?.length || 0}</span>
          </button>

          {!isReply && isLoggedIn && (
            <button
              onClick={() => onToggleReply(comment._id)}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer hover:text-white ${replyingToId === comment._id ? "text-white" : ""}`}
            >
              <MessageSquare className={iconSize} />
              <span>Reply</span>
              {comment.replies?.length > 0 && <span className="text-slate-500">({comment.replies.length})</span>}
            </button>
          )}

          {isAuthor && (
            <button
              onClick={() => onDelete(comment._id)}
              disabled={deletingId === comment._id}
              className="flex items-center gap-1 ml-auto text-slate-500 hover:text-rose-500 transition-colors cursor-pointer disabled:opacity-50"
            >
              {deletingId === comment._id ? <Loader2 className={`${iconSize} animate-spin`} /> : <Trash2 className={iconSize} />}
              <span>Delete</span>
            </button>
          )}
        </div>

        {/* Reply Input Box */}
        {!isReply && replyingToId === comment._id && isLoggedIn && (
          <div className="mt-4">
            <CommentInputForm
              user={user}
              value={replyText || ""}
              onChange={onReplyTextChange}
              onSubmit={(e) => onReplySubmit(e, comment._id)}
              onCancel={() => onToggleReply(null)}
              isSubmitting={submittingReply}
              placeholder={`Reply to ${authorName}...`}
              rows={2}
              size="sm"
              autoFocus
              submitLabel="Reply"
            />
          </div>
        )}

        {/* Nested Replies */}
        {!isReply && comment.replies?.length > 0 && (
          <div className="ml-2 pl-4 border-l-2 border-white/5 mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                user={user}
                isLoggedIn={isLoggedIn}
                currentUserId={currentUserId}
                deletingId={deletingId}
                onLike={(replyId) => onLike(comment._id, replyId)}
                onDislike={(replyId) => onDislike(comment._id, replyId)}
                onDelete={(replyId) => onDelete(comment._id, replyId)}
                requireAuth={requireAuth}
                isReply
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}