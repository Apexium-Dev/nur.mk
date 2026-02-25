"use client";

import React from "react";

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-24 pb-40 space-y-20">
      <section className="space-y-4">
        <h1 className="text-7xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter italic">
          NUR<span className="text-green-600">.MK</span>
        </h1>
        <p className="text-2xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 tracking-tight">
          Безвременски пораки. Современа форма.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-12 border-t border-slate-100 dark:border-slate-800 pt-12">
        <div className="space-y-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-green-600">
            Превод
          </h2>
          <p className="text-lg font-medium text-slate-500">
            Преземен од{" "}
            <a
              href="https://kuran-na-makedonski.net/"
              target="_blank"
              className="text-slate-900 dark:text-white underline decoration-green-500/30"
            >
              kuran-na-makedonski.net
            </a>
          </p>
        </div>
        <div className="space-y-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            Технологија
          </h2>
          <p className="text-lg font-medium text-slate-500">
            Арапски текст и аудио преку Al Quran Cloud API.
          </p>
        </div>
      </section>

      <section className="flex gap-16 items-center opacity-80">
        <div>
          <span className="block text-4xl font-black italic">6,236</span>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            Ајети
          </span>
        </div>
        <div>
          <span className="block text-4xl font-black italic">114</span>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            Сури
          </span>
        </div>
        <div>
          <span className="block text-4xl font-black italic text-green-600">
            0
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            Реклами
          </span>
        </div>
      </section>

      {/* Контакт */}
      <section className="pt-10">
        <a
          href="mailto:contact@nur.mk"
          className="inline-flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white border-b-2 border-green-500 pb-2 hover:text-green-600 transition-colors"
        >
          Контактирајте нè{" "}
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
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </section>
    </main>
  );
}
