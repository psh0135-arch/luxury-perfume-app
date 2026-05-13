import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { generateSitemap } from "./scripts/sitemap";

const sitemapPlugin = (): Plugin => ({
  name: "perfume-sitemap",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === "/sitemap.xml") {
        res.setHeader("Content-Type", "application/xml; charset=utf-8");
        res.end(generateSitemap());
        return;
      }
      next();
    });
  },
  generateBundle() {
    this.emitFile({
      type: "asset",
      fileName: "sitemap.xml",
      source: generateSitemap(),
    });
  },
});

// https://vitejs.dev/config/
// GitHub Pages는 https://<user>.github.io/<repo>/ 처럼 하위 경로에 배포되므로
// VITE_BASE 환경변수(예: "/auto-eda-pipeline/")로 base 경로를 지정합니다.
// 로컬/Lovable 호스팅에서는 그대로 "/" 를 사용합니다.
export default defineConfig(({ mode }) => ({
  base: process.env.VITE_BASE ?? "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger(), sitemapPlugin()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
