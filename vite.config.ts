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
    chunkSizeWarningLimit: 3500,
    rollupOptions: {
      output: {
        manualChunks: {
          "monaco-editor": ["monaco-editor"],
          "monaco-workers": [
            "monaco-editor/esm/vs/editor/editor.worker",
            "monaco-editor/esm/vs/language/json/json.worker",
            "monaco-editor/esm/vs/language/css/css.worker",
            "monaco-editor/esm/vs/language/html/html.worker",
            "monaco-editor/esm/vs/language/typescript/ts.worker",
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
