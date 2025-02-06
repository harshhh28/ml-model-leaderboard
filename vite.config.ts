import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@types": path.resolve(__dirname, "./src/types"),
      util: "util",
      path: "path-browserify",
      stream: "stream-browserify",
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          monaco: ["monaco-editor"],
          "monaco-languages": [
            "monaco-editor/esm/vs/basic-languages/python/python.contribution",
          ],
          vendor: [
            "react",
            "react-dom",
            "@supabase/supabase-js",
            "framer-motion",
          ],
        },
      },
    },
  },
});
