// client/vite.config.js
import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // If you are using a base path for your application (e.g., when deployed to a subdirectory),
  // set it here. Otherwise, you can omit this property.
  base: "/",

  // Configure the build output directory. By default, it is 'dist'.
  build: {
    outDir: path.resolve(__dirname, "dist"),
    // When setting `emptyOutDir: true`, Vite will empty the `outDir` on each build,
    // which can be useful to ensure no old files are left behind.
    emptyOutDir: true,
    // If you need to split your build into multiple chunks, configure the rollupOptions.
    // This is usually not required for smaller projects.
    rollupOptions: {
      // Example: Splitting vendor code into a separate chunk
      output: {
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
  },

  // If you need to proxy API requests during development, configure the server proxy here.
  server: {
    proxy: {
      // Proxy API requests to the Express server running on port 3000.
      "/api": "http://localhost:3000",
    },
  },

  // If you need to import modules using absolute paths (aliasing), configure them here.
  resolve: {
    alias: {
      // Example: Resolving '@' to 'src' directory
      "@": path.resolve(__dirname, "src"),
    },
  },
});
