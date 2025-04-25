import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from 'vite-svg-loader';

/** @ts-ignore */
import customHmr from "./src/plugins/customreload/CustomHmr";
import { APP_HEADER_HEIGHT, BOTTOM_HEADER_NAV_HEIGHT } from "./constants";

const { version: APP_VERSION, build_number: APP_BUILD_NUMBER } = require('./package.json');
const { appId: APPLICATION_ID, appName: APPLICATION_NAME } = require('./capacitor.config.json');

// https://vitejs.dev/config/
export default defineConfig(async ({command, mode}) => {

  // set environment variables for VITE
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  
  const BUILD_NUMBER = parseInt(APP_BUILD_NUMBER);
  const BUILD_DATE = Date.now();
  const BUILD_PHASE = 'Beta';
  const PLATFORM = process?.env?.PLATFORM ?? "web";
  const ISMOBILE = !!/android|ios/.exec(PLATFORM);
  const ISIOS = !!/ios/.exec(PLATFORM);
  const ISANDROID = !!/android/.exec(PLATFORM);
  const CLARITY_ID = process?.env?.CLARITY_ID ?? "oztc10g5eg";
  const SHOW_DEBUG = true;
  
  console.log("[PLATFORM]", PLATFORM);
  console.log("[APPLICATION_ID]", APPLICATION_ID);
  console.log("[APPLICATION_NAME]", APPLICATION_NAME);
  console.log("[APP_VERSION]", APP_VERSION);
  console.log("[BUILD_NUMBER]", BUILD_NUMBER);
  console.log("[BUILD_DATE]", new Date(BUILD_DATE));
  console.log("[ISMOBILE]", ISMOBILE);
  console.log("[ISIOS]", ISIOS);
  console.log("[ISANDROID]", ISANDROID);
  console.log("[CLARITY_ID]", CLARITY_ID);
  console.log("[SHOW_DEBUG]", SHOW_DEBUG);

  return ({
    define: {
      'import.meta.env.APPLICATION_ID': JSON.stringify(APPLICATION_ID),
      'import.meta.env.APPLICATION_NAME': JSON.stringify(APPLICATION_NAME),
      'import.meta.env.APP_VERSION': JSON.stringify(APP_VERSION),
      'import.meta.env.PLATFORM': JSON.stringify(PLATFORM),
      'import.meta.env.BUILD_DATE': JSON.stringify(new Date(BUILD_DATE)),
      'import.meta.env.BUILD_NUMBER': JSON.stringify(BUILD_NUMBER),
      'import.meta.env.BUILD_PHASE': JSON.stringify(BUILD_PHASE),
      'import.meta.env.ISMOBILE': ISMOBILE,
      'import.meta.env.IOS': ISIOS,
      'import.meta.env.ANDROID': ISANDROID,
      'import.meta.env.CLARITY_ID': JSON.stringify(CLARITY_ID),
      'import.meta.env.API_CLIENT_ID': JSON.stringify("iWtB7UWURISuhWODYJ6eljsHsQeHJPUW"),
      'import.meta.env.API_TOKEN': JSON.stringify("https://bedsideguideapp.elso.org/api/jwt"),
      'import.meta.env.API_REGISTER': JSON.stringify("https://bedsideguideapp.elso.org/api/BedsideGuide/register"),
      'import.meta.env.SHOW_DEBUG': JSON.stringify(SHOW_DEBUG),
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

    clearScreen: false,
    server: {
      port: 3005,
      watch: {},
    },
  })
});