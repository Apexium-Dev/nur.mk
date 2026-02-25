import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "nur.mk ",
  description:
    "Проучувајте го Куранот со современ превод на македонски, аудио рецитации и лесна навигација низ сури и џузови.",
  keywords: [
    "Куран",
    "Македонски",
    "Превод",
    "Ислам",
    "nur.mk",
    "Quran Macedonian",
  ],
  authors: [{ name: "nur.mk" }],
  openGraph: {
    title: "nur.mk - Светлина на вашиот пат",
    description: "Прочитајте го Благородниот Куран на македонски јазик.",
    url: "https://nur.mk",
    siteName: "nur.mk",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "mk_MK",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mk" suppressHydrationWarning>
      <body className="antialiased bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col min-h-screen transition-all duration-700 ease-in-out">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Navbar />

          <main className="flex-grow">{children}</main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
