import { defineConfig, loadEnv } from "vite";
import fs from "fs/promises";
import vue from "@vitejs/plugin-vue";
import svgLoader from 'vite-svg-loader';

/** @ts-ignore */
import customHmr from "./src/plugins/customreload/CustomHmr";
import { APP_HEADER_HEIGHT, BOTTOM_HEADER_NAV_HEIGHT } from "./constants";

const { version: APP_VERSION } = require('./package.json');
const BUILD_VERSION_FILE = "./build_version";

// https://vitejs.dev/config/
export default defineConfig(async ({command, mode}) => {

  // set environment variables for VITE
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  
  const BUILD_VERSION = await getBuildVersion();
  const BUILD_DATE = Date.now();
  const BUILD_PHASE = 'Alpha';
  const PLATFORM = process?.env?.PLATFORM ?? "web";
  const ISMOBILE = !!/android|ios/.exec(PLATFORM);
  const ISIOS = !!/ios/.exec(PLATFORM);
  const ISANDROID = !!/android/.exec(PLATFORM);
  
  console.log("[PLATFORM]", PLATFORM);
  console.log("[APP_VERSION]", APP_VERSION);
  console.log("[BUILD_VERSION]", BUILD_VERSION);
  console.log("[BUILD_DATE]", new Date(BUILD_DATE));
  console.log("[ISMOBILE]", ISMOBILE);
  console.log("[ISIOS]", ISIOS);
  console.log("[ISANDROID]", ISANDROID);

  return ({
    define: {
      'import.meta.env.APP_VERSION': JSON.stringify(APP_VERSION),
      'import.meta.env.PLATFORM': JSON.stringify(PLATFORM),
      'import.meta.env.BUILD_DATE': JSON.stringify(new Date(BUILD_DATE)),
      'import.meta.env.BUILD_VERSION': JSON.stringify(BUILD_VERSION),
      'import.meta.env.BUILD_PHASE': JSON.stringify(BUILD_PHASE),
      'import.meta.env.ISMOBILE': ISMOBILE,
      'import.meta.env.IOS': ISIOS,
      'import.meta.env.ANDROID': ISANDROID,
    },

    plugins: [customHmr(), vue(), svgLoader()],
  
    css: {
      preprocessorOptions: {
        scss: {
          // Deprecation Warning: The 'legacy' JS API is deprecated and will be removed in Dart Sass 2.0.0.
          api: 'modern-compiler', 
          // imports to components using scss
          additionalData: `
          @use 'sass:math';
          @import "@/styles/_core/_variables";
          @import "@/styles/_core/_utils";
          @import "@/styles/app/_variables";
          @import "@/styles/app/_scroller";

        ` + `$is-mobile: ${ISMOBILE};`
          + `$header-height: ${APP_HEADER_HEIGHT};`
          + `$footer-height: ${BOTTOM_HEADER_NAV_HEIGHT(ISIOS ? 20 : 0)};`

        }
      }
    },

    resolve: {
      extensions: ['.ts', '.js', '.vue', '.svg'],
      alias: [{ find: '@', replacement: '/src' }],
    },

    // base: "/",  
  
    clearScreen: false,
    server: {
      port: 3005,
      watch: {
        // ignored: ["**/src-tauri/**"],
      },
    },
  })
});

async function getBuildVersion() {
  // Build Version File - 
  const data = await fs.readFile(BUILD_VERSION_FILE, 'utf8');
  const parsedData = parseInt(data);
  return parsedData;
}