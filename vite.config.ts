import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/scout-api": {
        target: "https://scout-agent-jkrv.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/scout-api/, ""),
      },
    },
  },
});
