import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    root: path.resolve(__dirname, "src"), 
    plugins: [react()],
    base: 'app://./', 
    server: {
        port: 5173,
    },
    build: {
        outDir: path.resolve(__dirname, "dist"),
    },
});
