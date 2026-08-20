import React from "react";
import { getAvatarColor, getInitials } from "./utils/commentHelpers";

export default function Avatar({ name, size = "md" }) {
  const sizeClasses = size === "sm" ? "size-8 text-xs" : "size-10 text-sm";
  return (
    <div
      className={`${sizeClasses} rounded-full bg-linear-to-br ${getAvatarColor(
        name
      )} shrink-0 flex items-center justify-center font-bold text-white`}
    >
      {getInitials(name)}
    </div>
  );
}