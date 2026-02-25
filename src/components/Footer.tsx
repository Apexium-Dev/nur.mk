import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-slate-900 font-black text-sm transition-colors group-hover:bg-green-600 group-hover:text-white font-serif">
              Н
            </div>
            <span className="text-lg font-black tracking-tighter text-slate-900 dark:text-white">
              nur<span className="text-green-600">.mk</span>
            </span>
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600">
              © {new Date().getFullYear()}
            </span>
            <div className="flex gap-6">
              <Link
                href="/about"
                className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-green-600 transition-colors"
              >
                За нас
              </Link>
              <a
                href="mailto:contact@nur.mk"
                className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-green-600 transition-colors"
              >
                Контакт
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-slate-300 dark:text-slate-800">
            Светлина на вашиот пат
          </span>
        </div>
      </div>
    </footer>
  );
}
