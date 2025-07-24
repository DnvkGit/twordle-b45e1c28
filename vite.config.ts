import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/twordle/",  // <- This should be here at the root level
  server: {
    host: "::",
    port: 8080,
    // base doesn't go here
  },
  plugins: [
    // ... plugins
  ],
  resolve: {
    // ... resolve config
  },
}));

  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
