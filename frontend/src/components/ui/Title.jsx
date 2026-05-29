"use client";

import { useEffect, useRef, useState } from "react";

function MovieTitle({ title }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  const [isOverflowing, setIsOverflowing] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const textWidth = textRef.current.scrollWidth;

        if (textWidth > containerWidth) {
          setIsOverflowing(true);
          setTranslateX(textWidth - containerWidth);
        } else {
          setIsOverflowing(false);
          setTranslateX(0);
        }
      }
    };

    checkOverflow();

    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [title]);

  return (
    <div
      ref={containerRef}
      className={`
        w-50
        overflow-hidden
        pt-2
        ${!isOverflowing ? "flex justify-center" : ""}
      `}
    >
      <p
        ref={textRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="whitespace-nowrap inline-block"
        style={{
          transform:
            isOverflowing && isHovered
              ? `translateX(-${translateX}px)`
              : "translateX(0)",

          transition: isHovered
            ? "transform 1s linear"
            : "none",
        }}
      >
        {title}
      </p>
    </div>
  );
}

export default function Title({ title }) {
  return <MovieTitle title={title} />;
}