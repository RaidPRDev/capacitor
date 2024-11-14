/**
 * Updates the package version on Android and iOS Project files.
 * Increments Build Version
 * 
 */
import fs from "fs/promises";

const PACKAGE_JSON_FILE = "./package.json";
const ANDROID_PROJECT = "./android/app/build.gradle";
const IOS_PROJECT = "./ios/App/App.xcodeproj/project.pbxproj";

const PACKAGE_JSON = await fs.readFile(PACKAGE_JSON_FILE, 'utf8');
const PACKAGE_DATA = JSON.parse(PACKAGE_JSON);
const BUILD_NUMBER = parseInt(PACKAGE_DATA.build_number) + 1;

let resultData = "";

console.log(`Project Version: ${PACKAGE_DATA.version}`);
console.log(`Build Number: ${BUILD_NUMBER}`);

updateIOSProject();
updateAndroidProject();
updatePackageFile();

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
      const parseValue = BUILD_NUMBER;
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
      const parseValue = BUILD_NUMBER;
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

async function updatePackageFile() {
  console.log("Updating Package File");
  
  PACKAGE_DATA.build_number = BUILD_NUMBER.toString();
  await fs.writeFile(PACKAGE_JSON_FILE, JSON.stringify(PACKAGE_DATA, null, 2), 'utf8');
}