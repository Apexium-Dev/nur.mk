"use client";

import { useState, useRef, useEffect } from "react";

export default function AudioPlayer({
  sura,
  ayah,
  number, // нов проп за глобалниот број на ајетот
  reciter = "ar.alafasy",
}: {
  sura: number;
  ayah: number;
  number?: number;
  reciter?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [reciter]);

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      // го користиме глобалниот број (number) за да биде точниот ајет
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/${reciter}/${number}.mp3`;

      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.onended = () => setIsPlaying(false);
      } else {
        audioRef.current.src = audioUrl;
      }

      audioRef.current.play().catch((e) => console.error(e));
      setIsPlaying(true);
    }
  };

  return (
    <button
      onClick={toggleAudio}
      className={`p-2 rounded-xl transition-all duration-300 ${
        isPlaying
          ? "bg-green-500 text-white shadow-lg"
          : "bg-slate-50 text-slate-400 hover:text-green-600 dark:bg-slate-800"
      }`}
    >
      {isPlaying ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      ) : (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      )}
    </button>
  );
}
