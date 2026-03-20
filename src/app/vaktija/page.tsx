"use client";

import React, { useState, useEffect } from "react";

const CITIES = [
  { id: "skopje", mk: "Скопје" },
  { id: "bitola", mk: "Битола" },
  { id: "debar", mk: "Дебар" },
  { id: "tetovo", mk: "Тетово" },
  { id: "gostivar", mk: "Гостивар" },
  { id: "kumanovo", mk: "Куманово" },
  { id: "prilep", mk: "Прилеп" },
  { id: "ohrid", mk: "Охрид" },
  { id: "shtip", mk: "Штип" },
  { id: "struga", mk: "Струга" },
  { id: "strumica", mk: "Струмица" },
  { id: "veles", mk: "Велес" },
  { id: "kichevo", mk: "Кичево" },
];

export default function PrayerTimesPage() {
  const [mounted, setMounted] = useState(false);
  const [vaktijaData, setVaktijaData] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState("skopje");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [timings, setTimings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<any>(null);

  const prayerNames = [
    { key: "imsak", mk: "имсак" },
    { key: "sunrise", mk: "изгрејсонце" },
    { key: "dhuhr", mk: "пладне" },
    { key: "asr", mk: "икиндија" },
    { key: "maghrib", mk: "акшам" },
    { key: "isha", mk: "јација" },
  ];

  // Решавање на Hydration Error
  useEffect(() => {
    setMounted(true);
  }, []);

  // Тајмер за тековно време
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Вчитај го локалниот JSON
  useEffect(() => {
    fetch("/data/vreminja_makedonija_2026.json")
      .then((res) => {
        if (!res.ok) throw new Error("JSON фајлот не е најден во public/data/");
        return res.json();
      })
      .then((data) => {
        setVaktijaData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Грешка при вчитавање:", err);
        setLoading(false);
      });
  }, []);

  // Извлечи времиња за денес за избраниот град
  useEffect(() => {
    if (!vaktijaData) return;

    const now = new Date();
    const m = (now.getMonth() + 1).toString();
    const d = now.getDate().toString();

    const cityData = vaktijaData[selectedCity];
    if (cityData && cityData[m] && cityData[m][d]) {
      setTimings(cityData[m][d]);
    }
  }, [selectedCity, vaktijaData, currentTime.getDate()]);

  // Пресметај следен намаз и одбројување
  useEffect(() => {
    if (!timings) return;

    const calculateNext = () => {
      const now = new Date();
      let found = null;

      for (const p of prayerNames) {
        const [h, min] = timings[p.key].split(":").map(Number);
        const pDate = new Date();
        pDate.setHours(h, min, 0);

        if (pDate > now) {
          const diff = pDate.getTime() - now.getTime();
          const hrs = Math.floor(diff / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((diff % (1000 * 60)) / 1000);

          found = {
            name: p.mk,
            time: timings[p.key],
            remaining: `${hrs}ч ${mins}м ${secs}с`,
          };
          break;
        }
      }

      if (!found) {
        setNextPrayer({
          name: "имсак",
          time: timings.imsak,
          remaining: "утре",
        });
      } else {
        setNextPrayer(found);
      }
    };

    calculateNext();
  }, [currentTime, timings]);

  // Не рендерирај ништо додека не се вчита на клиент (Hydration fix)
  if (!mounted) return null;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-12 transition-colors duration-500">
      <div className="max-w-xl mx-auto">
        {/* СЕЛЕКТОР ЗА ГРАД - Модерна Верзија */}
        <div className="mb-8 relative z-50 flex justify-center">
          <div className="relative w-full max-w-xs">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-full px-6 py-4 text-lg font-black uppercase tracking-widest flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 outline-none text-slate-800 dark:text-white"
            >
              <span>
                {CITIES.find((c) => c.id === selectedCity)?.mk || "Избери Град"}
              </span>
              <svg
                className={`w-5 h-5 text-emerald-500 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsDropdownOpen(false)}
              />
            )}

            <div
              className={`absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[30px] shadow-2xl overflow-hidden transition-all duration-300 origin-top ${
                isDropdownOpen
                  ? "opacity-100 scale-y-100 translate-y-0"
                  : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                {CITIES.map((c) => {
                  const isSelected = selectedCity === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCity(c.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-6 py-3 rounded-2xl font-bold uppercase tracking-wider text-sm transition-colors duration-200 flex items-center justify-between ${
                        isSelected
                          ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {c.mk}
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ГЛАВЕН ТАЈМЕР */}
        <div className="relative p-10 mb-8 rounded-[45px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200 dark:shadow-none overflow-hidden">
          <div className="relative z-10 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-600 mb-4 block">
              следен намаз • {CITIES.find((c) => c.id === selectedCity)?.mk}
            </span>
            <h2 className="text-6xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white mb-2 leading-none">
              {nextPrayer?.name}
            </h2>
            <div className="text-4xl font-black text-slate-400 dark:text-slate-500 tracking-tighter italic tabular-nums">
              {nextPrayer?.remaining}
            </div>
          </div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* ЛИСТА ВАКТИЈА */}
        <div className="space-y-2 relative z-10">
          <div className="flex justify-between items-center px-6 py-4 mb-2">
            <div className="flex flex-col">
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
                вактија
              </h3>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {currentTime.toLocaleDateString("mk-MK", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="grid gap-2">
            {prayerNames.map((prayer) => {
              const isNext = nextPrayer?.name === prayer.mk;
              return (
                <div
                  key={prayer.key}
                  className={`flex items-center justify-between px-8 py-6 rounded-[30px] border transition-all duration-500 ${
                    isNext
                      ? "bg-emerald-600 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-[1.02] z-10"
                      : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                  }`}
                >
                  <span
                    className={`text-lg font-black uppercase italic tracking-tighter ${isNext ? "text-white" : "text-slate-400 dark:text-slate-500"}`}
                  >
                    {prayer.mk}
                  </span>
                  <span
                    className={`text-2xl font-black tracking-tighter ${isNext ? "text-white" : "text-slate-800 dark:text-slate-200"}`}
                  >
                    {timings?.[prayer.key] || "--:--"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <footer className="mt-16 text-center opacity-30 pb-10">
          <p className="text-[9px] font-black uppercase tracking-[0.6em] dark:text-white">
            нур.мк • 2026
          </p>
        </footer>
      </div>
    </main>
  );
}
