import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import flowbiteReact from "flowbite-react/plugin/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const targetUrl = env.VITE_CORS_URL;
  console.log(targetUrl)
  return {
    plugins: [react(), tailwindcss(), flowbiteReact()],
    server: {
      proxy: {
        '/api': {
          target: targetUrl,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        }
      },
    },
    build: {
      outDir: path.resolve(import.meta.dirname, '../server/public'),
      emptyOutDir: true,
    }
  };
});
