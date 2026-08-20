import React from "react";

export default function CommentSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 items-start animate-pulse">
          <div className="size-10 rounded-full bg-slate-800 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-slate-800 rounded w-32" />
            <div className="h-3 bg-slate-800 rounded w-full" />
            <div className="h-3 bg-slate-800 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}