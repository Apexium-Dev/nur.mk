"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import surasData from "@/data/kuran_makedonski.json";
import { surahNames } from "@/data/surah-info";
import AudioPlayer from "@/components/AudioPlayer";
import CopyButton from "@/components/CopyButton";
import BookmarkButton from "@/components/BookmarkButton";

export default function BookmarksPage() {
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedIds = JSON.parse(localStorage.getItem("nur-bookmarks") || "[]");
    const filtered = (surasData as any[]).filter((ayah: any) => {
      const id = `${ayah.sura}-${ayah.ayah}`;
      return savedIds.includes(id);
    });

    setBookmarkedAyahs(filtered);
    setLoading(false);
  }, []);

  if (loading)
    return (
      <div className="p-20 text-center font-bold text-slate-400 animate-pulse">
        Се вчитава...
      </div>
    );

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 pb-32">
      <header className="mb-20 space-y-6">
        <div className="space-y-2">
          <span className="text-red-500 font-black tracking-[0.3em] uppercase text-[10px]">
            Лична колекција
          </span>
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter italic">
            Ваши <span className="text-red-500">Обележани</span> ајети
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl leading-relaxed">
          Тука се наоѓаат сите ајети кои сте ги зачувале. Вашите обележувачи се
          чуваат локално во вашиот прелистувач.
        </p>
      </header>

      {bookmarkedAyahs.length === 0 ? (
        <div className="py-24 text-center bg-white dark:bg-slate-900 rounded-[40px] border-2 border-dashed border-slate-100 dark:border-slate-800 transition-colors">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 text-3xl">
            🔖
          </div>
          <p className="text-slate-400 dark:text-slate-500 font-medium mb-10 text-lg px-10">
            Сè уште немате зачувано ниеден ајет.
          </p>
          <Link
            href="/suras"
            className="inline-block bg-slate-900 dark:bg-green-600 text-white px-10 py-4 rounded-2xl font-black hover:scale-105 transition-all active:scale-95 shadow-xl shadow-slate-200 dark:shadow-none"
          >
            Истражи ги сурите
          </Link>
        </div>
      ) : (
        <div className="grid gap-10">
          {bookmarkedAyahs.map((ayah) => (
            <div
              key={`${ayah.sura}-${ayah.ayah}`}
              className="group bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="flex flex-wrap items-center justify-between gap-6 mb-10 border-b border-slate-50 dark:border-slate-800 pb-8">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600 dark:text-green-500">
                      {surahNames[ayah.sura]?.mk}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-slate-600 mt-1">
                      Ајет {ayah.ayah}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl">
                  <AudioPlayer
                    sura={Number(ayah.sura)}
                    ayah={Number(ayah.ayah)}
                  />
                  <CopyButton
                    text={ayah.text_mk}
                    sura={Number(ayah.sura)}
                    ayah={Number(ayah.ayah)}
                  />
                  <BookmarkButton
                    sura={Number(ayah.sura)}
                    ayah={Number(ayah.ayah)}
                  />
                </div>
              </div>

              <div className="space-y-8">
                <p className="text-3xl md:text-4xl text-slate-800 dark:text-slate-200 leading-relaxed font-semibold tracking-tight">
                  {ayah.text_mk}
                </p>

                <Link
                  href={`/sura/${ayah.sura}`}
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  Оди кон целата сура <span className="text-lg">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
