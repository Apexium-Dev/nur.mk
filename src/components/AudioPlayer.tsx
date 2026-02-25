"use client";

import { useState, useRef } from "react";

export default function AudioPlayer({
  sura,
  ayah,
}: {
  sura: number;
  ayah: number;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      const s = String(sura).padStart(3, "0");
      const a = String(ayah).padStart(3, "0");
      const audioUrl = `https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/${s}${a}.mp3`;

      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.onended = () => setIsPlaying(false);
      }

      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <button
      onClick={toggleAudio}
      className={`p-2 rounded-xl transition-all duration-300 ${
        isPlaying
          ? "bg-green-500 text-white shadow-lg shadow-green-200 scale-110"
          : "bg-slate-50 text-slate-400 hover:text-green-600 hover:bg-green-50"
      }`}
      title="Слушај го ајетот"
    >
      {isPlaying ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      )}
    </button>
  );
}
