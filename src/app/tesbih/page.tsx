"use client";

import React, { useState, useEffect } from "react";

const TUNE_OFFSETS = "0,-5,1,-3,-5,1,0,-5,0";

export default function TesbihPage() {
  const [count, setCount] = useState(0);
  const [circles, setCircles] = useState(0);
  const [goal, setGoal] = useState(33);
  const [history, setHistory] = useState<
    { time: string; period: string; count: number }[]
  >([]);
  const [timings, setTimings] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("tesbih-data");
    if (saved) {
      const parsed = JSON.parse(saved);
      setCount(parsed.count || 0);
      setCircles(parsed.circles || 0);
      setHistory(parsed.history || []);
    }

    fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=Skopje&country=North%20Macedonia&method=13&tune=${TUNE_OFFSETS}`,
    )
      .then((res) => res.json())
      .then((json) => setTimings(json.data.timings));
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "tesbih-data",
      JSON.stringify({ count, circles, history }),
    );
  }, [count, circles, history]);

  const getCurrentPeriod = () => {
    if (!timings) return "денес";
    const now = new Date();
    const timeToMin = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    const currentMin = now.getHours() * 60 + now.getMinutes();

    if (
      currentMin >= timeToMin(timings.Fajr) &&
      currentMin < timeToMin(timings.Dhuhr)
    )
      return "во сабах";
    if (
      currentMin >= timeToMin(timings.Dhuhr) &&
      currentMin < timeToMin(timings.Asr)
    )
      return "во пладне";
    if (
      currentMin >= timeToMin(timings.Asr) &&
      currentMin < timeToMin(timings.Maghrib)
    )
      return "во икиндија";
    if (
      currentMin >= timeToMin(timings.Maghrib) &&
      currentMin < timeToMin(timings.Isha)
    )
      return "во акшам";
    return "во јација";
  };

  const handleIncrement = () => {
    if (count + 1 >= goal) {
      const newEntry = {
        time: new Date().toLocaleTimeString("mk-MK", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        period: getCurrentPeriod(),
        count: goal,
      };
      setHistory((prev) => [newEntry, ...prev].slice(0, 5));
      setCount(0);
      setCircles((prev) => prev + 1);
      if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
    } else {
      setCount((prev) => prev + 1);
      if (window.navigator.vibrate) window.navigator.vibrate(40);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center transition-colors duration-500 p-6">
      <div className="max-w-sm w-full flex flex-col items-center">
        <header className="text-center w-full mb-8">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">
            тесбих
          </h1>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">
                кругови
              </span>
              <span className="text-lg font-black italic text-green-600 tracking-tighter">
                {circles}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">
                цел
              </span>
              <span className="text-lg font-black italic text-slate-900 dark:text-white tracking-tighter">
                {goal}
              </span>
            </div>
          </div>
        </header>

        <div className="relative w-72 h-72 flex items-center justify-center mb-8">
          <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-sm">
            <circle
              cx="144"
              cy="144"
              r="130"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-slate-100 dark:text-slate-900"
            />
            <circle
              cx="144"
              cy="144"
              r="130"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={816.8}
              strokeDashoffset={816.8 - (816.8 * count) / goal}
              strokeLinecap="round"
              className="text-green-600 transition-all duration-300"
            />
          </svg>

          <div className="text-[140px] font-black italic tracking-tighter text-slate-900 dark:text-white leading-none z-10 select-none">
            {count}
          </div>
        </div>

        <button
          onClick={handleIncrement}
          className="w-full py-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[32px] font-black uppercase italic text-2xl tracking-tighter active:scale-95 active:bg-green-600 dark:active:bg-green-600 active:text-white transition-all shadow-2xl mb-8"
        >
          притисни
        </button>

        {history.length > 0 && (
          <div className="w-full space-y-2 mb-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">
              последно
            </p>
            <div className="grid gap-2">
              {history.map((entry, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center px-5 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black dark:text-white uppercase italic leading-none mb-1">
                      {entry.period}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {entry.time} часот
                    </span>
                  </div>
                  <span className="text-xl font-black text-green-600 tracking-tighter">
                    +{entry.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="w-full flex items-center justify-between">
          <div className="flex gap-2">
            {[33, 99, 100].map((n) => (
              <button
                key={n}
                onClick={() => {
                  setCount(0);
                  setGoal(n);
                }}
                className={`w-10 h-10 rounded-xl text-[11px] font-black transition-all border ${goal === n ? "bg-green-600 border-green-600 text-white" : "bg-transparent border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
              >
                {n}
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              confirm("Ресетираш сè?") &&
              (setCount(0), setCircles(0), setHistory([]))
            }
            className="text-[10px] font-black uppercase tracking-widest text-red-500/70 hover:text-red-500 transition-colors"
          >
            ресетирај
          </button>
        </div>
      </div>
    </main>
  );
}
