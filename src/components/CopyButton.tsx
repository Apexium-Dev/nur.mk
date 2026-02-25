"use client";

import { useState } from "react";

export default function CopyButton({
  text,
  sura,
  ayah,
}: {
  text: string;
  sura: number;
  ayah: number;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const formatText = `"${text}" (Куран - Сура ${sura}, Ајет ${ayah}) — nur.mk`;
    navigator.clipboard.writeText(formatText);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-2 rounded-xl transition-all duration-300 ${
        copied
          ? "bg-green-600 text-white scale-110"
          : "bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100"
      }`}
      title="Копирај го ајетот"
    >
      {copied ? (
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
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}
