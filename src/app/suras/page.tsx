"use client";

import { useState } from "react";
import Link from "next/link";
import surasData from "@/data/kuran_makedonski.json";
import { surahNames } from "@/data/surah-info";

export default function SurasPage() {
  const [search, setSearch] = useState("");

  const allSuras = Array.from(new Set(surasData.map((s) => s.sura))).map(
    (num) => {
      const info = surahNames[num] || {
        mk: `Сура ${num}`,
        ar: "سورة",
        type: "Објавена",
      };
      const count = surasData.filter((s) => s.sura === num).length;
      return { number: num, ...info, ayahCount: count };
    },
  );

  const filteredSuras = allSuras.filter(
    (s) =>
      s.mk.toLowerCase().includes(search.toLowerCase()) ||
      s.number.toString() === search,
  );

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-2">
          <span className="text-green-600 dark:text-green-500 font-black tracking-[0.3em] uppercase text-[10px]">
            Индекс на поглавја
          </span>
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter italic">
            Сите <span className="text-green-600">Сури</span>
          </h1>
        </div>

        <div className="relative group w-full md:w-96">
          <input
            type="text"
            placeholder="Пребарај сура..."
            className="w-full px-8 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 rounded-[25px] shadow-sm focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500/50 transition-all placeholder-slate-300 dark:placeholder-slate-500"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {filteredSuras.map((sura) => (
          <Link
            key={sura.number}
            href={`/sura/${sura.number}`}
            className="group relative flex flex-col h-full p-10 bg-white dark:bg-slate-900 rounded-[45px] border border-slate-100 dark:border-slate-800 hover:border-green-200 dark:hover:border-green-900 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 active:scale-95 overflow-hidden"
          >
            <div className="flex justify-between items-start relative z-10 h-full">
              <div className="flex items-center gap-6">
                <span className="w-14 h-14 flex-none flex items-center justify-center rounded-2xl bg-slate-900 dark:bg-green-600 text-white font-black text-lg group-hover:bg-green-600 dark:group-hover:bg-green-500 transition-colors">
                  {sura.number}
                </span>

                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-1">
                    {sura.mk}
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    {sura.type} • {sura.ayahCount} Ајети
                  </p>
                </div>
              </div>

              <span className="text-3xl font-arabic text-slate-100 dark:text-slate-800/40 group-hover:text-green-600/20 transition-all duration-500 select-none ml-4 flex-none">
                {sura.ar}
              </span>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/[0.05] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </Link>
        ))}
      </div>

      {filteredSuras.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-slate-400 dark:text-slate-600 font-medium italic">
            Нема резултати за „{search}“
          </p>
        </div>
      )}
    </main>
  );
}
