/**
 * Applies a distribution profile to capacitor.config.json and to the native
 * iOS/Android projects, so one repo can produce builds for more than one
 * Apple/Google account.
 *
 *   node app.config.js            re-apply whatever capacitor.config.json holds
 *   node app.config.js elso       switch to capacitor.config.elso.json
 *   CAPACITOR_CONFIG=elso node app.config.js
 *
 * CAPACITOR_CONFIG (or the first argument) is a profile name or a path to a
 * config file. With neither, the config already in place is re-applied, which
 * keeps a plain `npm run build` from silently switching distributions.
 *
 * Flags: --list  --dry-run  --web-only
 */
import fs from "fs/promises";

const ACTIVE_CONFIG = "./capacitor.config.json";
const ANDROID_GRADLE = "./android/app/build.gradle";
const ANDROID_STRINGS = "./android/app/src/main/res/values/strings.xml";
const IOS_PROJECT = "./ios/App/App.xcodeproj/project.pbxproj";
const IOS_PLIST = "./ios/App/App/Info.plist";

const PROFILE_PATTERN = /^capacitor\.config\.(.+)\.json$/;
const APP_ID_PATTERN = /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/;

const args = process.argv.slice(2);
const flags = args.filter(a => a.startsWith("--"));
const DRY_RUN = flags.includes("--dry-run");
const WEB_ONLY = flags.includes("--web-only");
const requested = args.find(a => !a.startsWith("--")) ?? process.env.CAPACITOR_CONFIG ?? "";

if (flags.includes("--list")) {
  await listProfiles();
  process.exit(0);
}

const source = requested ? await resolveProfile(requested) : ACTIVE_CONFIG;
const CONFIG = JSON.parse(await fs.readFile(source, "utf8"));
const DIST = CONFIG.distribution ?? {};

if (!CONFIG.appId) fail(`${source} has no "appId"`);
if (!APP_ID_PATTERN.test(CONFIG.appId)) fail(`"${CONFIG.appId}" is not a valid app id`);

const ANDROID_NAME = DIST.androidDisplayName ?? DIST.displayName ?? CONFIG.appName;
const IOS_NAME = DIST.iosDisplayName ?? DIST.displayName ?? CONFIG.appName;

console.log(`Distribution: ${DIST.name ?? "(unnamed)"}${DIST.label ? ` - ${DIST.label}` : ""}`);
console.log(`Source: ${source}${DRY_RUN ? "   [dry run]" : ""}`);
console.log(`App Id: ${CONFIG.appId}`);
console.log(`App Name: ${CONFIG.appName}`);
console.log(`Display Name: ${ANDROID_NAME === IOS_NAME ? ANDROID_NAME : `${ANDROID_NAME} (android) / ${IOS_NAME} (ios)`}`);

if (source !== ACTIVE_CONFIG) {
  await writeIfChanged(ACTIVE_CONFIG, JSON.stringify(CONFIG, null, 2) + "\n");
}

if (WEB_ONLY) {
  console.log("Web config only - native projects left alone.");
} else {
  await updateAndroidProject();
  await updateIOSProject();
}

console.log("Distribution config applied!");

async function updateAndroidProject() {
  console.log("Updating Android Project");

  // applicationId is the store identity; the gradle namespace and the
  // MainActivity java package stay put so no source files have to move.
  await patch(ANDROID_GRADLE, data => replaceOne(
    data, ANDROID_GRADLE, /(applicationId\s+)(["'])(?:[^"']*)\2/,
    (_, prefix, quote) => `${prefix}${quote}${CONFIG.appId}${quote}`,
  ));

  await patch(ANDROID_STRINGS, data => {
    const values = {
      app_name: ANDROID_NAME,
      title_activity_main: ANDROID_NAME,
      package_name: CONFIG.appId,
      custom_url_scheme: CONFIG.appId,
    };
    for (const [key, value] of Object.entries(values)) {
      const searchReg = new RegExp(`(<string name="${key}">)([^<]*)(</string>)`);
      data = replaceOne(data, ANDROID_STRINGS, searchReg,
        (_, prefix, __, suffix) => `${prefix}${escapeXml(value)}${suffix}`);
    }
    return data;
  });
}

async function updateIOSProject() {
  console.log("Updating iOS Project");

  // One PRODUCT_BUNDLE_IDENTIFIER per build configuration (Debug + Release).
  await patch(IOS_PROJECT, data => replaceAll(
    data, IOS_PROJECT, /(PRODUCT_BUNDLE_IDENTIFIER\s*=\s*)(?:[^;]+)(;)/g,
    (_, prefix, suffix) => `${prefix}${CONFIG.appId}${suffix}`,
  ));

  await patch(IOS_PLIST, data => replaceOne(
    data, IOS_PLIST, /(<key>CFBundleDisplayName<\/key>\s*<string>)([^<]*)(<\/string>)/,
    (_, prefix, __, suffix) => `${prefix}${escapeXml(IOS_NAME)}${suffix}`,
  ));
}

async function patch(file, transform) {
  const data = await read(file);
  if (data === null) {
    console.log(`   skipped ${file} (not generated yet)`);
    return;
  }
  await writeIfChanged(file, transform(data));
}

function replaceOne(data, file, searchReg, replacer) {
  if (!searchReg.test(data)) fail(`no match for ${searchReg} in ${file}`);
  return data.replace(searchReg, replacer);
}

function replaceAll(data, file, searchReg, replacer) {
  if (!data.match(searchReg)) fail(`no match for ${searchReg} in ${file}`);
  return data.replace(searchReg, replacer);
}

async function writeIfChanged(file, next) {
  const current = await read(file);
  if (current === next) {
    console.log(`   unchanged ${file}`);
    return;
  }
  if (!DRY_RUN) await fs.writeFile(file, next, "utf8");
  console.log(`   ${DRY_RUN ? "would update" : "updated"} ${file}`);
}

async function read(file) {
  try {
    return await fs.readFile(file, "utf8");
  } catch (e) {
    if (e.code === "ENOENT") return null;
    throw e;
  }
}

async function resolveProfile(value) {
  const looksLikeAPath = value.match(PROFILE_PATTERN) || value.includes("/") || value.includes("\\");
  const candidates = looksLikeAPath ? [value] : [`./capacitor.config.${value}.json`, value];

  for (const candidate of candidates) {
    if (await read(candidate) !== null) return candidate;
  }
  console.error(`CAPACITOR_CONFIG "${value}" matches no config file. Available profiles:`);
  await listProfiles();
  process.exit(1);
}

async function listProfiles() {
  const entries = await fs.readdir(".");
  const active = JSON.parse(await fs.readFile(ACTIVE_CONFIG, "utf8"));
  for (const entry of entries.sort()) {
    const match = entry.match(PROFILE_PATTERN);
    if (!match) continue;
    const profile = JSON.parse(await fs.readFile(entry, "utf8"));
    const marker = profile.appId === active.appId ? "*" : " ";
    console.log(` ${marker} ${match[1].padEnd(12)} ${profile.appId.padEnd(30)} ${profile.distribution?.label ?? ""}`);
  }
  console.log("   (* = currently applied)");
}

function escapeXml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function fail(message) {
  console.error(`app.config.js: ${message}`);
  process.exit(1);
}
