import type { MetadataRoute } from "next";

const baseUrl = "https://nur.mk";

const staticRoutes = [
  "",
  "/about",
  "/bookmarks",
  "/esmaul-husna",
  "/juz",
  "/kategorii",
  "/learn",
  "/learn/iman",
  "/learn/namaz",
  "/learn/prophet",
  "/learn/rakah",
  "/learn/shahadah",
  "/learn/times",
  "/learn/wudu",
  "/mapa",
  "/suras",
  "/tesbih",
  "/vaktija",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  const surahPages: MetadataRoute.Sitemap = Array.from({ length: 114 }, (_, i) => ({
    url: `${baseUrl}/sura/${i + 1}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const juzPages: MetadataRoute.Sitemap = Array.from({ length: 30 }, (_, i) => ({
    url: `${baseUrl}/juz/${i + 1}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...surahPages, ...juzPages];
}
