import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Configuração simplificada sem top-level await e plugins ESM problemáticos
export default defineConfig(async () => {
  // Importação condicional do plugin do Replit apenas se disponível
  let runtimeErrorPlugin;
  try {
    const module = await import("@replit/vite-plugin-runtime-error-modal");
    runtimeErrorPlugin = module.default();
  } catch (error) {
    console.warn("⚠️  Plugin @replit/vite-plugin-runtime-error-modal not available, skipping...");
    runtimeErrorPlugin = null;
  }

  // Cartographer plugin condicional
  let cartographerPlugin;
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    try {
      const module = await import("@replit/vite-plugin-cartographer");
      cartographerPlugin = module.cartographer();
    } catch (error) {
      console.warn("⚠️  Plugin @replit/vite-plugin-cartographer not available, skipping...");
      cartographerPlugin = null;
    }
  }

  return {
    plugins: [
      react(),
      runtimeErrorPlugin,
      cartographerPlugin,
    ].filter(Boolean), // Remove null plugins
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
      target: 'es2020'
    },
    server: {
      port: Number(process.env.VITE_PORT) || 5173,
      strictPort: true,
      host: true,
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
    optimizeDeps: {
      esbuildOptions: { 
        target: 'es2020' 
      }
    },
  };
});