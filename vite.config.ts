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
export default defineConfig(({ mode }) => ({
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
