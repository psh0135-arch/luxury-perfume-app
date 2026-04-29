export const SITE_URL = "https://luxury-perfume-app.lovable.app";

// 정적으로 알려진 기본 이벤트 ID. 새 이벤트는 사용자 브라우저(localStorage)에만
// 존재하므로 빌드 타임 사이트맵에는 포함되지 않습니다.
const DEFAULT_EVENT_IDS = ["1", "2", "3"];

export function generateSitemap(siteUrl: string = SITE_URL): string {
  const today = new Date().toISOString().split("T")[0];

  const urls = [
    { loc: `${siteUrl}/`, changefreq: "daily", priority: "1.0" },
    ...DEFAULT_EVENT_IDS.map((id) => ({
      loc: `${siteUrl}/event/${id}`,
      changefreq: "weekly",
      priority: "0.8",
    })),
  ];

  const body = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}
