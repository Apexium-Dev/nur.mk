"use client";

import { useState, useEffect } from "react";
import { surahNames } from "@/data/surah-info";
import Link from "next/link";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("scroll", onClose);
  }, [onClose]);

  if (!isOpen) return null;

  const filtered = Object.entries(surahNames)
    .filter(
      ([id, info]) =>
        info.mk.toLowerCase().includes(query.toLowerCase()) ||
        id.includes(query),
    )
    .slice(0, 6);

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-xl bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-green-600"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            autoFocus
            type="text"
            placeholder="Пребарај сура..."
            className="w-full text-lg font-bold outline-none text-slate-800 placeholder:text-slate-300"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="p-2 max-h-[50vh] overflow-y-auto">
          {filtered.length > 0 ? (
            <div className="grid gap-1">
              {filtered.map(([id, info]) => (
                <Link
                  key={id}
                  href={`/sura/${id}`}
                  onClick={() => {
                    setQuery("");
                    onClose();
                  }}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl group transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 font-black group-hover:bg-green-600 group-hover:text-white transition-all text-xs">
                      {id}
                    </span>
                    <span className="font-bold text-slate-700">{info.mk}</span>
                  </div>
                  <span className="text-xl font-arabic text-slate-200 group-hover:text-green-600/20">
                    {info.ar}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-slate-400 font-medium">
              Нема резултати...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
