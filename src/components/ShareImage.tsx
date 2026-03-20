"use client";

import React, { useState, useRef, Fragment } from "react";
import * as htmlToImage from "html-to-image";

interface ShareAyahProps {
  arabic: string;
  macedonian: string;
  transliteration?: string;
  surahName: string;
  ayahNumber: number | string;
}

export default function ShareAyahImage({
  arabic,
  macedonian,
  transliteration,
  surahName,
  ayahNumber,
}: ShareAyahProps) {
  const [loading, setLoading] = useState(false);
  const [copiedFallback, setCopiedFallback] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const generateAndShare = async () => {
    if (!cardRef.current) return;
    setLoading(true);

    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `nur-mk-${ayahNumber}.png`, {
        type: "image/png",
      });

      const shareData = {
        title: `нур.мк - ${surahName}`,
        files: [file],
      };

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        const link = document.createElement("a");
        link.download = `nur-mk-${ayahNumber}.png`;
        link.href = dataUrl;
        link.click();

        setCopiedFallback(true);
        setTimeout(() => setCopiedFallback(false), 3000);
      }
    } catch (err) {
      console.error("Грешка при креирање слика", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      {/* 1. СКРИЕНАТА СЛИКА (APPLE СТИЛ - 1080x1920) */}
      <div
        className="fixed -left-[9999px] top-0 pointer-events-none z-[-1]"
        aria-hidden="true"
      >
        <div
          ref={cardRef}
          // Потполно црна позадина, огромни маргини (p-32)
          className="w-[1080px] h-[1920px] bg-black p-32 flex flex-col justify-between items-center relative box-border"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Inter", sans-serif',
          }}
        >
          {/* ТОП: Многу суптилно лого */}
          <div className="text-zinc-600 text-[1.75rem] font-semibold tracking-[0.5em] uppercase mt-10">
            NUR.MK
          </div>

          {/* СРЕДИНА: Текстот (чист фокус) */}
          <div className="flex flex-col items-center justify-center flex-1 w-full gap-20">
            {/* Арапски текст - чиста бела боја */}
            <p
              dir="rtl"
              className="text-[6.5rem] leading-[1.3] text-center text-white w-full"
              style={{ fontFamily: "'Noto Naskh Arabic', serif" }}
            >
              {arabic}
            </p>

            {/* Македонски превод - Apple "Zinc" сива боја */}
            <p className="text-[3.5rem] font-medium text-zinc-400 leading-[1.4] text-center max-w-[900px] tracking-tight">
              {macedonian}
            </p>
          </div>

          {/* ДНО: iOS стил "Pill" виџет за информациите */}
          <div className="mb-10 bg-zinc-900/80 border border-zinc-800 rounded-full px-12 py-6 flex items-center gap-6 shadow-2xl backdrop-blur-md">
            <span className="text-4xl font-medium text-white tracking-wide">
              {surahName}
            </span>
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-600"></div>
            <span className="text-4xl font-medium text-zinc-400 tracking-wide">
              Ајет {ayahNumber}
            </span>
          </div>
        </div>
      </div>

      {/* 2. ВИДЛИВОТО КОПЧЕ (Минималистичко копче за споделување) */}
      <button
        onClick={generateAndShare}
        disabled={loading}
        title="Сподели како Story"
        className="group relative p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white transition-all duration-300 disabled:opacity-50"
      >
        {loading ? (
          <svg
            className="animate-spin h-[18px] w-[18px] text-slate-900 dark:text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:scale-110 group-active:scale-95"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
        )}

        {copiedFallback && (
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded shadow-lg whitespace-nowrap z-50">
            ЗАЧУВАНО
          </span>
        )}
      </button>
    </Fragment>
  );
}
