"use client";

import React, { useState, useEffect, useMemo } from "react";
import surasData from "@/data/kuran_makedonski.json";
import { surahNames } from "@/data/surah-info";
import { juzMap } from "@/data/juz-info";
import Link from "next/link";
import AudioPlayer from "@/components/AudioPlayer";
import CopyButton from "@/components/CopyButton";
import BookmarkButton from "@/components/BookmarkButton";

const ITEMS_PER_PAGE = 20;

export default function JuzDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const juzId = parseInt(id);
  const mapping = juzMap[juzId];

  const [currentPage, setCurrentPage] = useState(1);
  const [lastRead, setLastRead] = useState<string | null>(null);
  const [extraData, setExtraData] = useState<Record<number, any>>({});
  const [loadingExtra, setLoadingExtra] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(`juz-${juzId}-last-read`);
    if (saved) setLastRead(saved);
  }, [juzId]);

  const allAyahsInJuz = useMemo(() => {
    return (surasData as any[]).filter((item) => {
      if (!mapping) return false;
      const isAfterStart =
        item.sura > mapping.startSura ||
        (item.sura === mapping.startSura && item.ayah >= mapping.startAyah);
      const isBeforeEnd =
        item.sura < mapping.endSura ||
        (item.sura === mapping.endSura && item.ayah <= mapping.endAyah);
      return isAfterStart && isBeforeEnd;
    });
  }, [mapping]);

  const uniqueSuras = useMemo(
    () => Array.from(new Set(allAyahsInJuz.map((a) => a.sura))),
    [allAyahsInJuz],
  );

  useEffect(() => {
    async function fetchAllData() {
      setLoadingExtra(true);
      const dataMap: Record<number, any> = {};
      try {
        await Promise.all(
          uniqueSuras.map(async (suraId) => {
            const [ar, tr] = await Promise.all([
              fetch(`https://api.alquran.cloud/v1/surah/${suraId}/ar.alafasy`),
              fetch(
                `https://api.alquran.cloud/v1/surah/${suraId}/en.transliteration`,
              ),
            ]);
            const arRes = await ar.json();
            const trRes = await tr.json();
            dataMap[suraId] = {
              arabic: arRes.data.ayahs,
              translit: trRes.data.ayahs,
            };
          }),
        );
        setExtraData(dataMap);
      } catch (e) {
        console.error(e);
      }
      setLoadingExtra(false);
    }
    if (uniqueSuras.length > 0) fetchAllData();
  }, [uniqueSuras]);

  const totalPages = Math.ceil(allAyahsInJuz.length / ITEMS_PER_PAGE);
  const currentAyahs = allAyahsInJuz.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const markAsRead = (ayahKey: string) => {
    localStorage.setItem(`juz-${juzId}-last-read`, ayahKey);
    setLastRead(ayahKey);
  };

  if (!mapping)
    return (
      <div className="p-20 text-center font-black uppercase tracking-widest">
        Џузот не постои.
      </div>
    );

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 pb-32 relative">
      <aside className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-2 p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-full border border-slate-100 dark:border-slate-800 shadow-2xl">
        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto no-scrollbar py-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => {
                setCurrentPage(n);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`w-10 h-10 flex-none rounded-full text-[10px] font-black transition-all duration-300 ${
                currentPage === n
                  ? "bg-green-600 text-white shadow-lg shadow-green-500/40 scale-110"
                  : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-green-600"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </aside>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 xl:hidden flex items-center gap-6 px-8 py-4 bg-slate-900/95 dark:bg-green-600/95 backdrop-blur-xl rounded-full shadow-2xl border border-white/10 transition-all active:scale-95">
        <button
          onClick={() => {
            setCurrentPage((prev) => Math.max(prev - 1, 1));
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          disabled={currentPage === 1}
          className="text-white disabled:opacity-20 p-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
            Страна
          </span>
          <span className="text-white text-sm font-black tracking-widest">
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
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6 6-6" />
          </svg>
        </button>
      </div>

      <header className="text-center mb-16 space-y-4">
        <Link
          href="/juz"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-green-600 transition-colors bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-800"
        >
          ← Сите џузови
        </Link>
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter transition-colors duration-500">
          Џуз {juzId}
        </h1>
        <div className="flex justify-center items-center gap-4 mt-4">
          <span className="h-1 w-12 bg-green-500 rounded-full opacity-30"></span>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">
            Дел {currentPage} од {totalPages}
          </p>
          <span className="h-1 w-12 bg-green-500 rounded-full opacity-30"></span>
        </div>
      </header>

      <div className="grid gap-12">
        {currentAyahs.map((ayah) => {
          const ayahKey = `${ayah.sura}-${ayah.ayah}`;
          const isLastRead = lastRead === ayahKey;
          const suraExtra = extraData[ayah.sura];

          return (
            <div
              key={ayahKey}
              onClick={() => markAsRead(ayahKey)}
              className={`group bg-white dark:bg-slate-900 rounded-[45px] p-8 md:p-14 border transition-all duration-500 cursor-pointer ${
                isLastRead
                  ? "border-green-500 ring-8 ring-green-500/5 shadow-2xl scale-[1.01]"
                  : "border-slate-100 dark:border-slate-800 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-12 border-b border-slate-50 dark:border-slate-800 pb-8 transition-colors duration-500">
                <div className="flex items-center gap-5">
                  <span
                    className={`w-14 h-14 flex items-center justify-center rounded-2xl font-black text-sm transition-all duration-500 ${isLastRead ? "bg-green-500 text-white" : "bg-slate-900 dark:bg-green-600 text-white"}`}
                  >
                    {ayah.ayah}
                  </span>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                      {surahNames[ayah.sura]?.mk}
                    </p>
                    {isLastRead && (
                      <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mt-1 animate-pulse">
                        Последно прочитано
                      </p>
                    )}
                  </div>
                </div>
                <div
                  className="flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <AudioPlayer
                    sura={Number(ayah.sura)}
                    ayah={Number(ayah.ayah)}
                  />
                  <BookmarkButton
                    sura={Number(ayah.sura)}
                    ayah={Number(ayah.ayah)}
                  />
                  <CopyButton
                    text={ayah.text_mk}
                    sura={Number(ayah.sura)}
                    ayah={Number(ayah.ayah)}
                  />
                </div>
              </div>

              <div className="space-y-12">
                {suraExtra && (
                  <p
                    dir="rtl"
                    className="text-4xl md:text-6xl font-arabic text-slate-900 dark:text-slate-100 text-right leading-[2] transition-colors duration-500"
                  >
                    {suraExtra.arabic[ayah.ayah - 1]?.text}
                  </p>
                )}
                {suraExtra && (
                  <div className="bg-slate-50/50 dark:bg-slate-800/50 p-6 rounded-3xl border-l-4 border-green-500/20 transition-all duration-500">
                    <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 italic font-medium leading-relaxed transition-colors duration-500">
                      {suraExtra.translit[ayah.ayah - 1]?.text}
                    </p>
                  </div>
                )}
                <p className="text-3xl md:text-4xl text-slate-800 dark:text-slate-200 leading-[1.5] font-semibold tracking-tight transition-colors duration-500">
                  {ayah.text_mk}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-20 flex flex-col items-center gap-6">
        {currentPage < totalPages ? (
          <button
            onClick={() => {
              setCurrentPage((prev) => prev + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="w-full md:w-auto px-16 py-8 bg-green-600 hover:bg-green-700 text-white rounded-[35px] shadow-2xl shadow-green-500/30 transition-all active:scale-95 flex flex-col items-center gap-2 group"
          >
            <span className="text-[11px] font-black uppercase tracking-[0.3em] opacity-80 group-hover:tracking-[0.4em] transition-all">
              Продолжи со читање
            </span>
            <span className="text-2xl font-black uppercase italic tracking-tighter">
              Следна страна ({currentPage + 1} од {totalPages})
            </span>
          </button>
        ) : (
          juzId < 30 && (
            <Link
              href={`/juz/${juzId + 1}`}
              className="w-full md:w-auto px-16 py-8 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[35px] shadow-2xl transition-all active:scale-95 flex flex-col items-center gap-2"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.3em] opacity-80">
                Завршен Џуз
              </span>
              <span className="text-2xl font-black uppercase italic tracking-tighter">
                Оди на следен џуз →
              </span>
            </Link>
          )
        )}
      </div>

      <footer className="mt-32 pt-12 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center opacity-40 text-[10px] font-black uppercase tracking-[0.5em] transition-colors duration-500">
        {juzId > 1 && <Link href={`/juz/${juzId - 1}`}>← Претходен</Link>}
        <span>nur.mk</span>
        {juzId < 30 && <Link href={`/juz/${juzId + 1}`}>Следен →</Link>}
      </footer>
    </main>
  );
}
