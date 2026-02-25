"use client";

import Link from "next/link";
import { surahNames } from "@/data/surah-info";
import { juzMap } from "@/data/juz-info";

export default function JuzPage() {
  const juzArray = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      <header className="space-y-6 text-center md:text-left">
        <div className="space-y-2">
          <span className="text-green-600 dark:text-green-500 font-black tracking-[0.3em] uppercase text-[10px] transition-colors duration-500">
            Систематизација
          </span>
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter italic transition-colors duration-500">
            Поделба на <span className="text-green-600">Џузови</span>
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed transition-colors duration-500">
          Куранот е традиционално поделен на 30 еднакви делови (џузови) за
          полесно следење на динамиката при секојдневното читање.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {juzArray.map((juzNum) => {
          const mapping = juzMap[juzNum];

          const suraName = mapping
            ? (surahNames[mapping.startSura]?.mk ?? `Сура ${mapping.startSura}`)
            : "Сура непозната";

          return (
            <Link
              key={juzNum}
              href={`/juz/${juzNum}`}
              className="group relative p-10 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 transition-[background-color,border-color] duration-500 ease-in-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-900/10 dark:hover:shadow-green-500/10"
            >
              <div className="absolute top-6 right-8 text-8xl font-black text-slate-50 dark:text-slate-800/40 group-hover:text-green-50 dark:group-hover:text-green-900/20 transition-colors duration-500 select-none">
                {juzNum}
              </div>

              <div className="relative space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-600 dark:text-green-500 transition-colors duration-500">
                    Дел
                  </span>
                  <div className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter transition-colors duration-500">
                    {juzNum}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50 dark:border-slate-800 transition-colors duration-500">
                  <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest mb-1 transition-colors duration-500">
                    Почнува со
                  </p>
                  <p className="text-lg font-bold text-slate-700 dark:text-slate-300 truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-500">
                    {suraName}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  Прочитај дел{" "}
                  <span className="text-green-600 dark:text-green-400">→</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
