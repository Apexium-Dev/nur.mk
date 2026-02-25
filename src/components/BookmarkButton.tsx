"use client";

import { useState, useEffect } from "react";

export default function BookmarkButton({
  sura,
  ayah,
}: {
  sura: number;
  ayah: number;
}) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const bookmarkId = `${sura}-${ayah}`;

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("nur-bookmarks") || "[]");
    setIsBookmarked(saved.includes(bookmarkId));
  }, [bookmarkId]);

  const toggleBookmark = () => {
    let saved = JSON.parse(localStorage.getItem("nur-bookmarks") || "[]");

    if (isBookmarked) {
      saved = saved.filter((id: string) => id !== bookmarkId);
    } else {
      saved.push(bookmarkId);
    }

    localStorage.setItem("nur-bookmarks", JSON.stringify(saved));
    setIsBookmarked(!isBookmarked);
  };

  return (
    <button
      onClick={toggleBookmark}
      className={`p-2 rounded-xl transition-all duration-300 ${
        isBookmarked
          ? "bg-red-50 text-red-500 scale-110"
          : "bg-slate-50 text-slate-400 hover:text-red-400 hover:bg-red-50"
      }`}
      title="Зачувај ајет"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={isBookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
