"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import surasData from "@/data/kuran_makedonski.json";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [lastRead, setLastRead] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("global-last-read");
    if (saved) setLastRead(JSON.parse(saved));
  }, []);

  const dailyAyah = {
    sura: 2,
    ayah: 286,
    text: "Аллах никого не го оптоварува над неговите можности...",
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="flex flex-col items-center text-center space-y-12">
          <div className="space-y-4">
            <h1 className="text-7xl md:text-[120px] font-black tracking-tighter leading-[0.8] text-slate-900 dark:text-white italic">
              NUR<span className="text-green-600">.MK</span>
            </h1>
            <p className="text-lg md:text-xl font-medium text-slate-400 uppercase tracking-[0.3em]">
              Светлина на вашиот пат
            </p>
          </div>

          {lastRead ? (
            <Link
              href={`/sura/${lastRead.surahId}#ayah-${lastRead.ayahKey.split("-")[1]}`}
              className="group relative inline-flex items-center gap-8 bg-slate-900 dark:bg-white p-4 pr-12 rounded-full transition-all hover:scale-105"
            >
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <div className="text-left">
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Продолжи со читање
                </span>
                <span className="text-white dark:text-slate-900 font-bold">
                  {lastRead.title} — Ајет {lastRead.ayahKey.split("-")[1]}
                </span>
              </div>
            </Link>
          ) : (
            <Link
              href="/suras"
              className="px-12 py-5 bg-green-600 text-white rounded-full font-black uppercase text-xs tracking-widest hover:bg-green-700 transition-all shadow-xl shadow-green-500/20"
            >
              Започни со читање
            </Link>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 bg-slate-50 dark:bg-slate-900 rounded-[60px] p-12 md:p-20 flex flex-col justify-between border border-slate-100 dark:border-slate-800">
            <div className="space-y-8">
              <span className="text-xs font-black uppercase tracking-[0.4em] text-green-600">
                Инспирација
              </span>
              <p className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight italic">
                „Аллах никого не го оптоварува над неговите можности.“
              </p>
            </div>
            <div className="mt-12 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-8">
              <span className="font-bold text-slate-400 italic">
                Ел-Бекаре, 286
              </span>
              <Link
                href="/sura/2"
                className="text-xs font-black uppercase tracking-widest hover:text-green-600 dark:text-white transition-colors underline underline-offset-8"
              >
                Цела сура
              </Link>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col gap-6">
            <Link
              href="/suras"
              className="flex-1 bg-green-600 rounded-[50px] p-10 text-white group hover:rotate-1 transition-transform"
            >
              <div className="h-full flex flex-col justify-between">
                <span className="text-4xl">📘</span>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic">
                    Сите
                    <br />
                    Сури
                  </h3>
                  <p className="text-xs font-bold opacity-60 mt-2">
                    114 ПОГЛАВЈА
                  </p>
                </div>
              </div>
            </Link>
            <Link
              href="/bookmarks"
              className="flex-1 bg-slate-900 rounded-[50px] p-10 text-white group hover:-rotate-1 transition-transform"
            >
              <div className="h-full flex flex-col justify-between">
                <span className="text-4xl">⭐</span>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic">
                    Твои
                    <br />
                    Омилени
                  </h3>
                  <p className="text-xs font-bold opacity-60 mt-2">
                    ОБЕЛЕЖАНИ АЈЕТИ
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-40 text-center">
        <div className="max-w-2xl mx-auto px-6 space-y-8 opacity-30">
          <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 mx-auto rounded-full"></div>
          <p className="text-lg font-medium italic text-slate-500">
            Платформа создадена за мир, размислување и духовност.
          </p>
        </div>
      </section>
    </main>
  );
}
