import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import electron from "vite-plugin-electron/simple";
import { notBundle } from "vite-plugin-electron/plugin";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    electron({
      main: {
        entry: "electron/main.ts",
        vite: {
          plugins: [notBundle()],
          build: {
            lib: { formats: ["cjs"] },
            rollupOptions: { output: { entryFileNames: "[name].cjs", format: "cjs" } },
          },
        },
      },
      preload: { input: "electron/preload.ts", vite: { plugins: [notBundle()] } },
    }),
  ],
});
