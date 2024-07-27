import { defineConfig, loadEnv } from "vite";
import fs from "fs/promises";
import vue from "@vitejs/plugin-vue";
import svgLoader from 'vite-svg-loader';

const { version: APP_VERSION } = require('./package.json');
const BUILD_VERSION_FILE = "./build_version";

// https://vitejs.dev/config/
export default defineConfig(async ({command, mode}) => {

  // set environment variables for VITE
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  const BUILD_VERSION = await getBuildVersion();
  const PLATFORM = process?.env?.PLATFORM ?? "web";
  const ISMOBILE = !!/android|ios/.exec(PLATFORM);
  const ISIOS = !!/ios/.exec(PLATFORM);
  const ISANDROID = !!/android/.exec(PLATFORM);
  
  console.log("[PLATFORM]", PLATFORM);
  console.log("[APP_VERSION]", APP_VERSION);
  console.log("[BUILD_VERSION]", BUILD_VERSION);
  console.log("[ISMOBILE]", ISMOBILE);
  console.log("[ISIOS]", ISIOS);
  console.log("[ISANDROID]", ISANDROID);

  return ({
    define: {
      'import.meta.env.APP_VERSION': JSON.stringify(APP_VERSION),
      'import.meta.env.PLATFORM': JSON.stringify(PLATFORM),
      'import.meta.env.BUILD_VERSION': JSON.stringify(BUILD_VERSION),
      'import.meta.env.ISMOBILE': ISMOBILE,
      'import.meta.env.IOS': ISIOS,
      'import.meta.env.ANDROID': ISANDROID,
    },
    plugins: [vue(), svgLoader()],
  
    css: {
      preprocessorOptions: {
        scss: {
          // imports to components using scss
          additionalData: `
          @use 'sass:math';
          @import "./src/styles/_core/_variables";
          @import "./src/styles/_core/_utils";
          @import "./src/styles/app/_fonts";
          @import "./src/styles/app/_variables";

        ` + `$is-mobile: ${ISMOBILE};`
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

async function getBuildVersion() {
  // Build Version File - 
  const data = await fs.readFile(BUILD_VERSION_FILE, 'utf8');
  const parsedData = parseInt(data);
  return parsedData;
}
