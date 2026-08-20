import React from "react";
import { Loader2, Send } from "lucide-react";
import Avatar from "./Avatar";

export default function CommentInputForm({
  user,
  value,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting,
  placeholder = "Add a public comment...",
  rows = 3,
  size = "md",
  autoFocus = false,
  submitLabel = "Comment",
}) {
  return (
    <form onSubmit={onSubmit} className="flex gap-3 md:gap-4 items-start">
      <Avatar name={user?.name} size={size === "sm" ? "sm" : "md"} />
      <div className="flex-1 flex flex-col gap-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          autoFocus={autoFocus}
          className={`w-full bg-[#141414] border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors resize-none ${
            size === "sm" ? "text-xs rounded-lg p-2" : "text-sm"
          }`}
        />
        {(value.trim() || onCancel) && (
          <div className="flex justify-end gap-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting || !value.trim()}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Send className="size-3.5" />
              )}
              {submitLabel}
            </button>
          </div>
        )}
      </div>
    </form>
  );
}