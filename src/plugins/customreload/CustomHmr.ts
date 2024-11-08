import { PluginOption } from "vite";
import fsSync from "fs";
import fs from "fs/promises";

const SOURCE_CONSTANTS_FILE = "./constants.ts";
const TARGET_CONSTANTS_FILE = "./src/_core/Constants.ts";


const DATA_PATH = `public/assets/data/app`;
const COMPILED_DATA_PATH = "public/assets/data/app/compiled";
const DATA = [
  `panic`,
  `checklists`,
  `medications`,
  `equipment`,
  `calculators`,
];
const DEBUG = false;

export default function CustomHmr():PluginOption {
  
  return {
    name: 'custom-hmr',
    enforce: 'post',
    config(config, { command }) {
      console.log(`[BUILD_CONFIG] ${config}`);
      console.log('[BUILD_COMMAND]', command);
    },
    async buildStart(options) {
      console.log('[BUILD_START]', options);
      startJSONCompiler();

      // Copy Constants
      console.log('[COPYING_CONSTANTS]');
      copyFile(SOURCE_CONSTANTS_FILE, TARGET_CONSTANTS_FILE);
    },
    // HMR
    async handleHotUpdate({ file, server }) {
      // console.log(`handleHotUpdate json file... [${file}]`);

      if (file.includes(COMPILED_DATA_PATH)) {
        if (DEBUG) console.log(`++++++++++++++++++ IGNORED [${file}]`);
        return;
      }

      // check if part of json data path
      if (file.includes(DATA_PATH) && file.endsWith('.json')) {
        console.log('[RELOADING_JSON_DATA]');
        console.log(`[FILE][${file}]\n`);

        await startJSONCompiler()

        // Copy Constants
        console.log('[COPYING_CONSTANTS]');
        copyFile(SOURCE_CONSTANTS_FILE, TARGET_CONSTANTS_FILE);

        server.ws.send({
          type: 'full-reload',          
          path: '*'
        });
      }
    }
  }
}

export async function startJSONCompiler() {

  console.log(`[START_JSON_BUILD] \n`);

  // create target folder is !exists
  if (!fsSync.existsSync(COMPILED_DATA_PATH)){
    fsSync.mkdirSync(COMPILED_DATA_PATH);
  }

  for (let i = 0; i < DATA.length; i++) {
    await compileJSONData(`${DATA[i]}`, DATA_PATH, COMPILED_DATA_PATH);  
  }

  console.log(`Writing completed \n`);

  console.log(`[END_JSON_BUILD] \n`);
}

export async function compileJSONData(file: string, sourcePath: string = "", targetPath: string = "") {
  
  console.log(`Reading [${file}] data`);
  
  // Build Version File - 
  const data = await fs.readFile(`${sourcePath}/${file}.json`, 'utf8');
  const parsedData = JSON.parse(data);

  // start compilation
  iterateArray(parsedData, null, (item:any, index:number, parent:any) => {
    switch (file) {
      case "checklists":
        const isCheckList = parent && parent?.layout === "checklist";
        if (isCheckList) item.id = `${parent.id}#${index}`;  
        else {
          if (item.branchTo) item.id = `${item.branchTo}#${index}`;  
        }
      break;
      default: 
        if (parent) {
          // item.id = `${parent.id}$$${index}`;  
          // if (item.branchTo) item.branchTo = `${item.branchTo}$$${index}`;  
        }
        else {
          // item.id = `${item.id}$$${index}`;  
          // if (item.branchTo) item.branchTo = `${item.branchTo}$$${index}`;  
        }
    }
  });

  console.log(`Writing [${file}] data to ${targetPath}/${file}_compiled.json \n`);
  await fs.writeFile(`${targetPath}/${file}_compiled.json`, JSON.stringify(parsedData, null, 4), 'utf8');

  return parsedData;
}

function iterateArray(arr:Array<any> = [], parent: Record<string, any> | null = null, callback?:Function) {
  arr.forEach((item, index) => {
      // console.log(`ID: ${item.id}, Type: ${item.type}, Label: ${item.label}`);
      
      callback && callback(item, index, parent);

      if (Array.isArray(item.items) && item.items.length > 0) {
        // Pass the current item as the parent
        iterateArray(item.items, item, callback);
      }
  });
}

function copyFile(source: string, destination: string) {
  // Check if the source file exists
  // if (!fsSync.existsSync(source)) {
  //     console.error(`Source file does not exist: ${source}`);
  //     return;
  // }

  // // Check if the destination directory exists, create it if not
  // const destinationDir = destination;
  // if (!fsSync.existsSync(destinationDir)) {
  //   fsSync.mkdirSync(destinationDir, { recursive: true });
  // }

  // Copy the file
  fsSync.copyFile(source, destination, (err) => {
      if (err) {
          console.error(`Error copying file: ${err}`);
      } else {
          console.log(`File copied successfully to ${destination}`);
      }
  });
}