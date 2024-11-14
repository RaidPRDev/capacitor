import { PluginOption } from "vite";
import fsSync from "fs";
import fs from "fs/promises";
import { BranchViewData } from "@/types";

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
  `resources`,
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
      await copyFile(SOURCE_CONSTANTS_FILE, TARGET_CONSTANTS_FILE);
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
  const parsedData: BranchViewData[] = JSON.parse(data);

  // start compilation
  let count = 0, ParentItem: any  = null, total = 0;
  iterateArray(parsedData, null, (item:any, index:number, parent:any) => {
    switch (file) {
      case "checklists":
        const isCheckList = parent && parent?.layout === "checklist";
        if (isCheckList) {
          item.id = `${parent.id}#${index}`;  
        } else {
          if (item.branchTo) item.id = `${item.branchTo}#${index}`;  
        }

        if (ParentItem) {

        }

        const checkParentItem = item && item?.layout === "checklist"
        && item?.type === "subchecklist";

        if (checkParentItem) {
          if (ParentItem !== item) {
            
            if (ParentItem !== null) {
              ParentItem.totalChecks = count;
              total += count;
            }
            
            count = 0;
            ParentItem = item;
          }
        }
        else {
          const checkIfCheckBox = item && item?.hasOwnProperty("checked");
          if (checkIfCheckBox) count++;
        }

      break;
      default: 
    }
  });

  console.log(`Writing [${file}] data to ${targetPath}/${file}_compiled.json \n`);
  await fs.writeFile(`${targetPath}/${file}_compiled.json`, JSON.stringify(parsedData, null, 0), 'utf8');

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

export function flattenChecklist(items: any, level: number = 1) {
  const result = [] as any[];

  items.forEach((item:any) => {
    
    // Copy the item and add the class based on the current level
    const flattenedItem = { ...item, class: `sub-level-${level}` };

    if (item.type === 'subchecklist' && item.items && item.items.length > 0) {
      flattenedItem.isRootParent = true;
    }

    result.push(flattenedItem);

    // If the item has a 'subchecklist' type and contains nested items, process them
    if (item.type === 'subchecklist' && item.items && item.items.length > 0) {
      result.push(...flattenChecklist(item.items, level + 1));
    }
  });

  return result;
}

export function findCheckListByID(id: string, items: any, level: number = 1) {
  console.log("findCheckListByID: ", id);
  
  let selectedItem = null;
  
  for (let i = 0; i < items.length - 1; i++) {
    const item = items[i];
    console.log("YES_item: ", item.id);
    if (item.id == id) {
      console.log("YES_FUUUUUUUUUUUUUUUUUCCC_item: ", item.id);
      selectedItem = item;
      break;
    }
    if (item && item.type === 'subchecklist' && item.items && item.items.length > 0) {
      findCheckListByID(id, item.items, level + 1);
    }
  }
  
  // items.forEach((item:any) => {
    
  //   if (item.id === id) {
  //     return item;
  //   }

  //   // If the item has a 'subchecklist' type and contains nested items, process them
  //   if (item.type === 'subchecklist' && item.items && item.items.length > 0) {
  //     findCheckListByID(id, item.items, level + 1);
  //   }
  // });

  return selectedItem;
}

async function copyFile(source: string, destination: string) {
  const CONSTANTS_DATA = await fs.readFile(source, 'utf8');

  let data = "/* **********************************************************************\n";
  data += "************************************************************************\n";
  data += "*** DO NOT MODIFY! USE constants.ts IN THE PROJECT ROOT FOLDER ***\n";
  data += "************************************************************************\n";
  data += "************************************************************************** */\n\n";
  data += CONSTANTS_DATA;

  await fs.writeFile(`${destination}`, data, 'utf8');
}