/**
 * Updates the package version on Android and iOS Project files.
 * Increments Build Version
 * 
 */
import fs from "fs/promises";

const BUILD_VERSION_FILE = "./build_version";
const ANDROID_PROJECT = "./android/app/build.gradle";
const IOS_PROJECT = "./ios/App/App.xcodeproj/project.pbxproj";

const PACKAGE_JSON = await fs.readFile("./package.json", 'utf8');
const PACKAGE_DATA = JSON.parse(PACKAGE_JSON);

const buildNumber = await getBuildVersion() + 1;

let resultData = "";

console.log(`Project Version: ${PACKAGE_DATA.version}`)
console.log(`Build Number: ${buildNumber}`)

updateIOSProject();
updateAndroidProject();
updateBuildFile(buildNumber);

console.log("Project Build and Version Updated!")

async function updateAndroidProject() {
  console.log("Updating Android Project");
  resultData = "";

  // Android Project File - 
  const data = await fs.readFile(ANDROID_PROJECT, 'utf8');
  
  // versionCode = 1
  // const regex = /(versionCode\\s+)([^\\s]+)/;
  let searchReg = new RegExp('(versionCode\\s+)([^\\s]+)', 'g');
  let match = data.match(searchReg);
  if (match) {
    resultData = data.replace(searchReg, (_, prefix, oldValue) => {
      // buildNumber = parseInt(oldValue);
      // const parseValue = parseInt(oldValue) + 1;
      const parseValue = buildNumber;
      return `${prefix}${parseValue}`;
    });
  }
  
  // versionName = "0.0.1"
  // const regex = /(versionName\\s+"[^"]+")/;
  searchReg = new RegExp('(versionName\\s+"[^"]+")', 'g');
  match = resultData.match(searchReg);
  if (match) {
    resultData = resultData.replace(searchReg, (match) => match.replace(/"[^"]+"/, `"${PACKAGE_DATA.version}"`));
  }
  
  await fs.writeFile(ANDROID_PROJECT, resultData, 'utf8');
  // console.log("resultData")
  // console.log(resultData)
}

async function updateIOSProject() {
  console.log("Updating iOS Project");
  resultData = "";

  // iOS Project File - 
  const data = await fs.readFile(IOS_PROJECT, 'utf8');
  
  // CURRENT_PROJECT_VERSION = 1;
  // const regex = /(CURRENT_PROJECT_VERSION\\s*=\\s*)([^\\s;]+)(;)/;
  let searchReg = new RegExp('(CURRENT_PROJECT_VERSION\\s*=\\s*)([^\\s;]+)(;)', 'g');
  let match = data.match(searchReg);
  if (match) {
    resultData = data.replace(searchReg, (_, prefix, oldValue, suffix) => {
      // const parseValue = parseInt(oldValue) + 1;
      const parseValue = buildNumber;
      return `${prefix}${parseValue}${suffix}`;
    });
  }
  
  // MARKETING_VERSION = 0.0.1;
  // const regex = /(MARKETING_VERSION\\s*=\\s*)([^\\s;]+)(;)/;
  searchReg = new RegExp('(MARKETING_VERSION\\s*=\\s*)([^\\s;]+)(;)', 'g');
  match = resultData.match(searchReg);
  if (match) {
    resultData = resultData.replace(searchReg, (_, prefix, oldValue, suffix) => {
      const newValue = PACKAGE_DATA.version;
      return `${prefix}${newValue}${suffix}`;
    });
    
  }

  await fs.writeFile(IOS_PROJECT, resultData, 'utf8');
  // console.log("resultData")
  // console.log(resultData)
}

async function getBuildVersion() {
  // Build Version File - 
  const data = await fs.readFile(BUILD_VERSION_FILE, 'utf8');
  const parsedData = parseInt(data);
  return parsedData;
}

async function updateBuildFile(buildNumber) {
  // Build Version File - 
  await fs.writeFile(BUILD_VERSION_FILE, buildNumber.toString(), 'utf8');
}