import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from 'vite-svg-loader';
// import { internalIpV4 } from "internal-ip";
import { version } from './package.json';

const PLATFORM = process.env.TAURI_ENV_PLATFORM;

const mobile = !!/android|ios/.exec(PLATFORM);
const isIOS = !!/ios/.exec(PLATFORM);
const isAndroid = !!/android/.exec(PLATFORM);

// https://vitejs.dev/config/
export default defineConfig(async () => ({

  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(version),
    'import.meta.env.PLATFORM': PLATFORM,
    'import.meta.env.ISMOBILE': mobile,
    'import.meta.env.IOS': isIOS,
    'import.meta.env.ANDROID': isAndroid,
  },
  
  plugins: [vue(), svgLoader()],

  css: {
    preprocessorOptions: {
      scss: {
        // global style access for components
        additionalData: `
          @import "./src/styles/_core/_variables";
          @import "./src/styles/_core/_utils";
          @import "./src/styles/app/_fonts";
          @import "./src/styles/app/_variables";

        ` + `$is-mobile: ${mobile};`
      }
    }
  },

  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 3005,
    // strictPort: true,
    // host: mobile ? "0.0.0.0" : false,
    // hmr: mobile
    //   ? {
    //       protocol: "ws",
    //       host: await internalIpV4(),
    //       port: 1421,
    //     }
    //   : undefined,
    // watch: {
    //   // 3. tell vite to ignore watching `src-tauri`
    //   ignored: ["**/src-tauri/**"],
    // },
  },
}));
