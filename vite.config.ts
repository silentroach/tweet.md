import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    sourcemap: true,
  },
  plugins: [
    dts({
      entryRoot: "src",
      include: ["src"],
      exclude: ["src/__tests__"],
      outDir: "dist",
    }),
  ],
});
