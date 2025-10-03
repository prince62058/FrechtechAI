import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const loadReplitPlugins = async () => {
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    try {
      const [errorModal, cartographer] = await Promise.all([
        import("@replit/vite-plugin-runtime-error-modal"),
        import("@replit/vite-plugin-cartographer")
      ]);
      return [errorModal.default(), cartographer.cartographer()];
    } catch (e) {
      console.log("Running without Replit plugins (VS Code mode)");
      return [];
    }
  }
  return [];
};

export default defineConfig(async () => ({
  plugins: [
    react(),
    ...(await loadReplitPlugins()),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
}));
