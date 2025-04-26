import { PluginOption } from "vite";
import fsSync from "fs";
import fs from "fs/promises";
import { BranchViewData, ISearchData } from "@/types";
import { parseLabelToListFormat } from "../../utils/StringTools";
import { convertMathSymbols } from "../../utils/ElsoMath";

const SOURCE_CONSTANTS_FILE = "./constants.ts";
const TARGET_CONSTANTS_FILE = "./src/_core/Constants.ts";


const DATA_PATH = `public/assets/data/app`;
const COMPILED_DATA_PATH = "public/assets/data/app/compiled";
const SEARCH_JSON_DATA_FILE = "search_compiled.json";

let searchData: Array<ISearchData> = [];

const DATA = [
  `ecmo`,
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

  // generate compiled data
  for (let i = 0; i < DATA.length; i++) {
    await compileJSONData(`${DATA[i]}`, DATA_PATH, COMPILED_DATA_PATH);  
    await compileSearchJSONData(`${DATA[i]}`, DATA_PATH, COMPILED_DATA_PATH);
  }

  // write search json
  console.log("SEARCH_JSON_DATA_FILE", SEARCH_JSON_DATA_FILE)
  console.log(`Writing [${SEARCH_JSON_DATA_FILE}] data to ${COMPILED_DATA_PATH}/${SEARCH_JSON_DATA_FILE} \n`);
  await fs.writeFile(`${COMPILED_DATA_PATH}/${SEARCH_JSON_DATA_FILE}`, JSON.stringify(searchData, null, 0), 'utf8');
  
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

        if (item.label) item.label = convertMathSymbols(item.label);
        if (item.label) item.label = parseLabelToListFormat(item.label);

      break;
      case "panic": 
        if (item.label) item.label = parseLabelToListFormat(item.label);
        // if (item.label && item.class && item.class.indexOf("list-format") > -1) {
        //   item.label = parseLabelToListFormat(item.label);
        // }
      break;
      case "ecmo": 
        if (item.title) item.title = convertMathSymbols(item.title);
        if (item.label) item.label = parseLabelToListFormat(item.label);
      break;
      case "calculators": 
        if (item.title) item.title = convertMathSymbols(item.title);
        if (item.content) item.content = convertMathSymbols(item.content);
        if (item.label) item.label = convertMathSymbols(item.label);
      break;

      default: 
    }
  });

  console.log(`Writing [${file}] data to ${targetPath}/${file}_compiled.json \n`);
  await fs.writeFile(`${targetPath}/${file}_compiled.json`, JSON.stringify(parsedData, null, 0), 'utf8');

  return parsedData;
}

export async function compileSearchJSONData(file: string, sourcePath: string = "", targetPath: string = "") {
  
  console.log(`Compiling for Search [${file}] data`, targetPath);
  
  // Build Version File - 
  const data = await fs.readFile(`${sourcePath}/${file}.json`, 'utf8');
  const parsedData: BranchViewData[] = JSON.parse(data);

  let routePath = "";                                 // route
  let validItems: Record<string, any> = {}            // valid cached items

  let list = [] as any[];
  if (file === "checklists") {
    list = flattenChecklistNoStore(parsedData, 1) as any[];
    list.forEach((item, index) => {
      if (item?.hasOwnProperty("isRootParent")) return;

      if (index < 1000) {
        // console.log("item.disabled", item?.class?.indexOf("disabled"));
        
        if (item?.class?.indexOf("disabled") > -1) return;
        
        if (item.layout === "list") {
          // console.log("LIST.id", item.id);
          routePath = `${file}/${item.id}`;

          if (item?.items) {
            item?.items?.forEach((innerItem:any) => {
              if (innerItem?.class === "disabled") return;

              // console.log("LIST_ITEM.branchTo", innerItem.branchTo);
              if (!validItems.hasOwnProperty(`${innerItem.branchTo}`)) {
                validItems[`${innerItem.branchTo}`] = {}
              }
              // save parent
              validItems[`${innerItem.branchTo}`] = item.id;
            })
          }
  
          // save to search data
          searchData.push({
            category: file,
            id: item.id,
            title: item.title,
            keywords: item.title?.toLowerCase(), 
            path: routePath
          })
        }
        else if (item.layout === "checklist") {
          // check dict if we have a valid item
          if (!validItems.hasOwnProperty(`${item.id}`)) return;
          
          // console.log("CHECKLIST.id", item);
          // console.log("item.label", item.label);
          
          // get parent
          routePath = validItems[`${item.id}`];

          // build route
          routePath = `${file}/${routePath}/${item.id}`;

          // save to search data
          searchData.push({
            category: file,
            id: item.id,
            title: item.title,
            keywords: item.keywords?.toLowerCase(), 
            path: routePath
          })
        }
      }
    })
  }
  else if (file === "medications") {
    list = flattenChecklistNoStore(parsedData, 1) as any[];
    list.forEach((item, index) => {
      if (item?.hasOwnProperty("isRootParent")) return;

      if (index < 1000) {
        // console.log("item.disabled", item?.class?.indexOf("disabled"));
        
        if (item?.class?.indexOf("disabled") > -1) return;
        
        if (item.layout === "list") {
          //console.log("LIST.id", item.id);
          routePath = `${file}/${item.id}`;

          if (item?.items) {
            item?.items?.forEach((innerItem:any) => {
              if (innerItem?.class === "disabled") return;

              //console.log("LIST_ITEM.branchTo", innerItem.branchTo);
              if (!validItems.hasOwnProperty(`${innerItem.branchTo}`)) {
                validItems[`${innerItem.branchTo}`] = {}
              }
              // save parent
              validItems[`${innerItem.branchTo}`] = item.id;

              // save to search data
              searchData.push({
                category: file,
                id: innerItem.branchTo,
                title: innerItem.label,
                keywords: innerItem.label?.toLowerCase(), 
                path: `${routePath}/${innerItem.branchTo}`
              })
            })
          }
  
          // save to search data
          searchData.push({
            category: file,
            id: item.id,
            title: item.title,
            keywords: item.title?.toLowerCase(), 
            path: routePath
          })
        }
      }
    })
  }
  else if (file === "equipment") {
    list = flattenChecklistNoStore(parsedData, 1) as any[];
    list.forEach((item, index) => {
      if (item?.hasOwnProperty("isRootParent")) return;

      if (index < 1000) {
        // console.log("item.disabled", item?.class?.indexOf("disabled"));
        
        if (item?.class?.indexOf("disabled") > -1) return;
        
        if (item.layout === "list") {
          //console.log("LIST.id", item.id);
          routePath = `${file}/${item.id}`;

          if (item?.items) {
            item?.items?.forEach((innerItem:any) => {
              if (innerItem?.class === "disabled") return;

              //console.log("LIST_ITEM.branchTo", innerItem.branchTo);
              if (!validItems.hasOwnProperty(`${innerItem.branchTo}`)) {
                validItems[`${innerItem.branchTo}`] = {}
              }
              // save parent
              validItems[`${innerItem.branchTo}`] = item.id;

              // save to search data
              searchData.push({
                category: file,
                id: innerItem.branchTo,
                title: innerItem.label,
                keywords: innerItem.label?.toLowerCase(), 
                path: `${routePath}/${innerItem.branchTo}`
              })
            })
          }
  
          // save to search data
          searchData.push({
            category: file,
            id: item.id,
            title: item.title,
            keywords: item.title?.toLowerCase(), 
            path: routePath
          })
        }
      }
    })
  }
  else if (file === "calculators") {
    list = flattenChecklistNoStore(parsedData, 1) as any[];
    list.forEach((item, index) => {
      if (item?.hasOwnProperty("isRootParent")) return;

      if (index < 1000) {
        // console.log("item.disabled", item?.class?.indexOf("disabled"));
        
        if (item?.class?.indexOf("disabled") > -1) return;
        
        if (item.layout === "list") {
          //console.log("LIST.id", item.id);
          routePath = `${file}/${item.id}`;

          if (item?.items) {
            item?.items?.forEach((innerItem:any) => {
              if (innerItem?.class === "disabled") return;

              //console.log("LIST_ITEM.branchTo", innerItem.branchTo);
              if (!validItems.hasOwnProperty(`${innerItem.branchTo}`)) {
                validItems[`${innerItem.branchTo}`] = {}
              }
              // save parent
              validItems[`${innerItem.branchTo}`] = item.id;

              // save to search data
              searchData.push({
                category: file,
                id: innerItem.branchTo,
                title: innerItem.label,
                keywords: innerItem.label?.toLowerCase(), 
                path: `${routePath}/${innerItem.branchTo}`
              })
            })
          }
  
          // save to search data
          searchData.push({
            category: file,
            id: item.id,
            title: item.title,
            keywords: item.title?.toLowerCase(), 
            path: routePath
          })
        }
      }
    })
  }
  else if (file === "resources") {
    list = flattenChecklistNoStore(parsedData, 1) as any[];
    list.forEach((item, index) => {
      
      if (item?.hasOwnProperty("isRootParent")) return;
      
      if (index < 1000) {
        // console.log("item.disabled", item?.class?.indexOf("disabled"));
        // if (item?.class?.indexOf("disabled") > -1) return;

        if (item.layout === "default") {
          // console.log("LIST.id", item.id);
          routePath = `${file}/${item.id}`;

          if (item?.items) {
            item?.items?.forEach((innerItem:any) => {
              if (innerItem?.class === "disabled") return;

              // console.log("LIST_ITEM.branchTo", innerItem.branchTo);
              if (!validItems.hasOwnProperty(`${innerItem.branchTo}`)) {
                validItems[`${innerItem.branchTo}`] = {}
              }
              // save parent
              validItems[`${innerItem.branchTo}`] = item.id;

              // save to search data
              searchData.push({
                category: file,
                id: innerItem.branchTo,
                title: innerItem.label,
                keywords: innerItem.label?.toLowerCase(), 
                path: `${routePath}/${innerItem.branchTo}`
              })
            })
          }
  
          // save to search data
          searchData.push({
            category: file,
            id: item.id,
            title: item.title,
            keywords: item.title?.toLowerCase(), 
            path: routePath
          })
        }
        
      }
    })
  }

  // console.log(`Writing [${file}] data to ${targetPath}/${file}_compiled.json \n`);
  // await fs.writeFile(`${targetPath}/${file}_compiled.json`, JSON.stringify(parsedData, null, 0), 'utf8');

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

export function flattenChecklistNoStore(items: any, level: number = 1) {
  const result = [] as any[];

  items.forEach((item:any) => {
    
    // Copy the item and add the class based on the current level
    const flattenedItem = { ...item, class: `${item.class} sub-level-${level}` };

    if (item.type === 'subchecklist' && item.items && item.items.length > 0) {
      // flattenedItem.isRootParent = true;
    }
    
    result.push(flattenedItem);

    // If the item has a 'subchecklist' type and contains nested items, process them
    if (item.type === 'subchecklist' && item.items && item.items.length > 0) {
      result.push(...flattenChecklistNoStore(item.items, level + 1));
    }
  });

  return result;
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