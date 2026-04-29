import { defaultEventSeeds } from "../src/data/events";

export const SITE_URL = "https://luxury-perfume-app.lovable.app";

export function generateSitemap(siteUrl: string = SITE_URL): string {
  const today = new Date().toISOString().split("T")[0];

  const urls: { loc: string; changefreq: string; priority: string; lastmod: string }[] = [
    { loc: `${siteUrl}/`, changefreq: "daily", priority: "1.0", lastmod: today },
  ];

  for (const e of defaultEventSeeds) {
    urls.push({
      loc: `${siteUrl}/event/${e.id}`,
      changefreq: "weekly",
      priority: "0.8",
      lastmod: today,
    });
  }

  const body = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}
