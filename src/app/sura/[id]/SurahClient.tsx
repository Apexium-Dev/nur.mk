"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import surasData from "@/data/kuran_makedonski.json";
import { surahNames } from "@/data/surah-info";
import Link from "next/link";
import AudioPlayer from "@/components/AudioPlayer";
import CopyButton from "@/components/CopyButton";
import BookmarkButton from "@/components/BookmarkButton";
import ShareAyahImage from "@/components/ShareImage";

const ITEMS_PER_PAGE = 20;

const RECITERS = [
  { id: "ar.alafasy", name: "мишари ел-афаси" },
  { id: "ar.shaatree", name: "абу бакр аш-шатри" },
  { id: "ar.ahmedajamy", name: "ахмед ел-аџми" },
  { id: "ar.husary", name: "ел-хусари" },
  { id: "ar.hudhaify", name: "ел-худејфи" },
  { id: "ar.mahermuaiqly", name: "махер ел-муајкли" },
  { id: "ar.minshawi", name: "ел-миншави" },
  { id: "ar.muhammadayyoub", name: "мухамед ајуб" },
  { id: "ar.muhammadjibreel", name: "мухамед џибрил" },
];

export default function SurahClient({ id }: { id: string }) {
  const surahId = Number.parseInt(id, 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastRead, setLastRead] = useState<string | null>(null);
  const [extraData, setExtraData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReciter, setSelectedReciter] = useState("ar.alafasy");

  const [isFullSurahPlaying, setIsFullSurahPlaying] = useState(false);
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState<number | null>(
    null,
  );
  const fullAudioRef = useRef<HTMLAudioElement | null>(null);

  const info = surahNames[surahId] || {
    mk: `сура ${surahId}`,
    ar: "سورة",
    type: "објавена",
  };

  const allAyahs = useMemo(() => {
    return (surasData as any[]).filter((item) => Number(item.sura) === surahId);
  }, [surahId]);

  const totalPages = Math.ceil(allAyahs.length / ITEMS_PER_PAGE);

  const playFullSurah = (startFromIndex = 0) => {
    if (isFullSurahPlaying) {
      fullAudioRef.current?.pause();
      setIsFullSurahPlaying(false);
      setCurrentPlayingAyah(null);
      return;
    }

    const playNext = (index: number) => {
      if (index >= allAyahs.length || !extraData) {
        setIsFullSurahPlaying(false);
        setCurrentPlayingAyah(null);
        return;
      }
      const ayahObj = extraData.arabic[index];
      setCurrentPlayingAyah(ayahObj.numberInSurah);
      setIsFullSurahPlaying(true);
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/${selectedReciter}/${ayahObj.number}.mp3`;
      if (fullAudioRef.current) {
        fullAudioRef.current.src = audioUrl;
      } else {
        fullAudioRef.current = new Audio(audioUrl);
      }
      fullAudioRef.current.play();
      fullAudioRef.current.onended = () => playNext(index + 1);
    };
    playNext(startFromIndex);
  };

  useEffect(() => {
    const saved = localStorage.getItem(`sura-${surahId}-last-read`);
    if (saved) {
      setLastRead(saved);
      const ayahNum = Number.parseInt(saved.split("-")[1] ?? "1", 10);
      setCurrentPage(Math.ceil(ayahNum / ITEMS_PER_PAGE));
    }
    const savedReciter = localStorage.getItem("selected-reciter");
    if (savedReciter) setSelectedReciter(savedReciter);
    return () => {
      fullAudioRef.current?.pause();
      fullAudioRef.current = null;
    };
  }, [surahId]);

  useEffect(() => {
    async function fetchExtra() {
      setLoading(true);
      try {
        const [ar, tr] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}/quran-uthmani`),
          fetch(
            `https://api.alquran.cloud/v1/surah/${surahId}/en.transliteration`,
          ),
        ]);
        const arRes = await ar.json();
        const trRes = await tr.json();
        if (arRes.data && trRes.data) {
          setExtraData({
            arabic: arRes.data.ayahs,
            translit: trRes.data.ayahs,
          });
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    if (surahId >= 1 && surahId <= 114) fetchExtra();
  }, [surahId]);

  const currentAyahs = allAyahs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const markAsRead = (ayahKey: string) => {
    localStorage.setItem(`sura-${surahId}-last-read`, ayahKey);
    setLastRead(ayahKey);
  };

  if (allAyahs.length === 0)
    return (
      <div className="p-10 text-center font-black dark:text-white uppercase">
        сурата не е пронајдена.
      </div>
    );

  return (
    <main className="max-w-5xl mx-auto px-6 py-2 pb-16 relative">
      <aside className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-1 p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-100 dark:border-slate-800 shadow-lg">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => {
              setCurrentPage(n);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`w-7 h-7 rounded-full text-[9px] font-bold transition-all ${currentPage === n ? "bg-green-600 text-white" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
          >
            {n}
          </button>
        ))}
      </aside>

      {/* ВРАТЕНО: МОБИЛНО МЕНИ ЗА СТРАНИЦИ */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 xl:hidden flex items-center gap-4 px-6 py-3 bg-slate-900/90 dark:bg-green-600/90 backdrop-blur-md rounded-full shadow-xl border border-white/10">
        <button
          onClick={() => {
            setCurrentPage((prev) => Math.max(prev - 1, 1));
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          disabled={currentPage === 1}
          className="text-white disabled:opacity-20 p-1"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-white text-[8px] font-black uppercase opacity-70">
            страна
          </span>
          <span className="text-white text-xs font-black">
            {currentPage} / {totalPages}
          </span>
        </div>
        <button
          onClick={() => {
            setCurrentPage((prev) => Math.min(prev + 1, totalPages));
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          disabled={currentPage === totalPages}
          className="text-white disabled:opacity-20 p-1"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path d="m9 18 6-6 6-6" />
          </svg>
        </button>
      </div>

      <header className="text-center mb-6 space-y-3">
        <Link
          href="/suras"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-green-600 bg-slate-50 dark:bg-slate-900 px-4 py-1.5 rounded-full border border-slate-100 dark:border-slate-800"
        >
          ← сите сури
        </Link>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter transition-colors duration-500">
          {info.mk}
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-3 mt-4">
          <button
            onClick={() => playFullSurah()}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${isFullSurahPlaying ? "bg-red-500 text-white animate-pulse" : "bg-green-600 text-white hover:bg-green-700 shadow-md"}`}
          >
            {isFullSurahPlaying ? "стопирај" : "пушти ја цела сура"}
          </button>
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-slate-900 dark:text-white">
            <span className="text-[8px] font-black text-slate-400 uppercase">
              глас:
            </span>
            <select
              value={selectedReciter}
              onChange={(e) => {
                setSelectedReciter(e.target.value);
                localStorage.setItem("selected-reciter", e.target.value);
              }}
              className="bg-transparent text-[10px] font-bold outline-none cursor-pointer"
            >
              {RECITERS.map((r) => (
                <option key={r.id} value={r.id} className="dark:bg-slate-900">
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-3xl md:text-4xl font-arabic text-slate-300 dark:text-slate-700 tracking-[0.2em] transition-colors duration-500">
          {info.ar}
        </p>
      </header>

      {surahId !== 9 && currentPage === 1 && (
        <div className="text-center mb-6">
          <p
            dir="rtl"
            className="text-3xl md:text-4xl font-arabic text-slate-800 dark:text-slate-200 leading-tight"
          >
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
          <div className="w-8 h-1 bg-green-500 mx-auto mt-3 rounded-full opacity-20"></div>
        </div>
      )}

      <div className="grid gap-3">
        {currentAyahs.map((ayah, index) => {
          const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
          const ayahKey = `${ayah.sura}-${ayah.ayah}`;
          const isLastRead = lastRead === ayahKey;
          const isCurrentlyPlaying =
            isFullSurahPlaying && currentPlayingAyah === ayah.ayah;
          const extraAyah = extraData?.arabic?.[globalIndex];

          return (
            <div
              key={ayahKey}
              id={`ayah-${ayah.ayah}`}
              onClick={() => markAsRead(ayahKey)}
              className={`group bg-white dark:bg-slate-900 rounded-[25px] p-4 md:p-6 border transition-all duration-300 cursor-pointer ${isCurrentlyPlaying ? "border-green-500 ring-2 ring-green-500/10 shadow-md" : isLastRead ? "border-green-200" : "border-slate-100 dark:border-slate-800 shadow-sm"}`}
            >
              <div className="flex items-center justify-between mb-3 border-b border-slate-50 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 flex items-center justify-center rounded-lg font-black text-[10px] ${isCurrentlyPlaying || isLastRead ? "bg-green-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}
                  >
                    {ayah.ayah}
                  </span>
                  {isCurrentlyPlaying && (
                    <span className="text-[7px] font-black text-green-600 uppercase tracking-widest animate-pulse">
                      се пее...
                    </span>
                  )}
                </div>
                <div
                  className="flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {extraAyah && (
                    <AudioPlayer
                      sura={ayah.sura}
                      ayah={ayah.ayah}
                      number={extraAyah.number}
                      reciter={selectedReciter}
                    />
                  )}
                  <BookmarkButton sura={ayah.sura} ayah={ayah.ayah} />
                  {extraAyah && (
                    <ShareAyahImage
                      arabic={extraAyah.text}
                      macedonian={ayah.text_mk}
                      transliteration={extraData.translit[globalIndex]?.text}
                      surahName={info.mk}
                      ayahNumber={ayah.ayah}
                    />
                  )}
                  <CopyButton
                    text={ayah.text_mk}
                    sura={ayah.sura}
                    ayah={ayah.ayah}
                  />
                </div>
              </div>
              <div className="space-y-3">
                {extraData?.arabic && (
                  <p
                    dir="rtl"
                    className="text-2xl md:text-3xl font-arabic text-slate-900 dark:text-slate-100 text-right leading-relaxed"
                  >
                    {extraData.arabic[globalIndex]?.text}
                  </p>
                )}
                {extraData?.translit && (
                  <div className="bg-slate-50/50 dark:bg-slate-800/50 p-3 rounded-xl border-l-2 border-green-500/20">
                    <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 italic font-medium leading-relaxed">
                      {extraData.translit[globalIndex]?.text}
                    </p>
                  </div>
                )}
                <p className="text-lg md:text-xl text-slate-800 dark:text-slate-200 leading-snug font-medium tracking-tight transition-colors duration-500">
                  {ayah.text_mk}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex flex-col items-center gap-4">
        {currentPage < totalPages ? (
          <button
            onClick={() => {
              setCurrentPage((prev) => prev + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="w-full md:w-auto px-10 py-5 bg-green-600 hover:bg-green-700 text-white rounded-3xl shadow-lg transition-all active:scale-95 flex flex-col items-center gap-1 group"
          >
            <span className="text-[9px] font-black uppercase tracking-widest opacity-80 group-hover:tracking-widest transition-all text-center">
              продолжи со читање
            </span>
            <span className="text-lg font-black uppercase italic tracking-tighter text-center">
              следна страна ({currentPage + 1} од {totalPages})
            </span>
          </button>
        ) : (
          surahId < 114 && (
            <Link
              href={`/sura/${surahId + 1}`}
              className="w-full md:w-auto px-10 py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-3xl shadow-lg transition-all active:scale-95 flex flex-col items-center gap-1 group"
            >
              <span className="text-[9px] font-black uppercase tracking-widest opacity-80 text-center">
                завршена сура
              </span>
              <span className="text-lg font-black uppercase italic tracking-tighter text-center">
                оди на следна сура →
              </span>
            </Link>
          )
        )}
      </div>

      <footer className="mt-12 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center opacity-40 text-[8px] font-black uppercase tracking-widest dark:text-white transition-colors duration-500">
        <span>нур.мк</span>
        <div className="flex gap-4">
          {surahId > 1 && <Link href={`/sura/${surahId - 1}`}>претходна</Link>}
          {surahId < 114 && <Link href={`/sura/${surahId + 1}`}>следна</Link>}
        </div>
      </footer>
    </main>
  );
}
