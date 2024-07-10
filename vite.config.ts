import { Capacitor } from '@capacitor/core';
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from 'vite-svg-loader';

const { version } = require('./package.json');

const PLATFORM = Capacitor.getPlatform();
const mobile = !!/android|ios/.exec(PLATFORM);
const isIOS = !!/ios/.exec(PLATFORM);
const isAndroid = !!/android/.exec(PLATFORM);

// https://vitejs.dev/config/
export default defineConfig(async ({command, mode}) => {

  // set environment variables for VITE
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  console.log("[PLATFORM]", PLATFORM);
  // console.log("========================================");

  return ({
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
          // imports to components using scss
          additionalData: `
            @import "./src/styles/_core/_variables";
            @import "./src/styles/_core/_utils";
            @import "./src/styles/app/_fonts";
            @import "./src/styles/app/_variables";
            $is-mobile: true;
          ` 
        }
      }
    },

    resolve: {
      extensions: ['.ts', '.js', '.vue', '.svg'],
      alias: [{ find: '@', replacement: '/src' }],
    },
  
  
    clearScreen: false,
    server: {
      port: 3005,
      watch: {
        // ignored: ["**/src-tauri/**"],
      },
    },
  })
});
