import { BranchViewData } from "@/ui/navigation/branching/types";
import { loadJSONFile } from "@/utils/FileTools";
import { ShallowRef } from "vue";

// branch view components
import BranchDefault from '@/components/branching/branches/BranchDefault.vue';
import BranchHTML from '@/components/branching/branches/BranchHTML.vue';
import BranchList from '@/components/branching/branches/BranchList.vue';
import BranchChecklist from '@/components/branching/branches/BranchChecklist.vue';
import BranchInput from "../branches/BranchInput.vue";
import { BranchDataQuery, BranchUID } from "../types";

export async function loadViewData(url: string, views: ShallowRef<BranchViewData[]>) {
  
  return new Promise<any>(async (resolve) => {

    const data = await loadJSONFile(`/assets/data/${url}`) as BranchViewData[];
    if (!Array.isArray(data)) resolve([]);

    views.value = data?.map((dataItem) => {
      const viewData = dataItem;
      switch (viewData.layout) {
        case "list":
          viewData.component = BranchList;
        break;
        
        case "checklist":
          viewData.component = BranchChecklist;
        break;
        
        case "input":
          viewData.component = BranchInput;
        break;
        
        case "html":
          viewData.component = BranchHTML;
        break;
        
        default:
          viewData.component = BranchDefault;
        break;
      }
      return viewData;
    });

    resolve(views);
  })
  
  // setTimeout(() => { loading.value = false; }, 750);
}

/**
 * 
 * @param uid 
 * @returns 
 */
export function parseBranchUID(uid:string): BranchUID {
  return uid?.split?.('#') as BranchUID;
}

/**
 * 
 * @param uid 
 * @returns 
 */
export function getBranchQueryByUID(uid:string, type:string):BranchDataQuery {
  const uidData = parseBranchUID(uid);

  let queryParams: BranchDataQuery = { type: '', id: '', childId: '' };
  queryParams.type = type;
  queryParams.id = uidData[0];
  queryParams.childId = uidData?.[1] ?? '';

  return queryParams;
}

/**
 * Function to parse an HTML string and extract content inside double curly braces.
 * The content inside the double curly braces should be a string with items divided by '##'.
 * The function splits the content into an array of items.
 *
 * @param {string} htmlString - The HTML string containing double curly braces.
 * @returns {Array<Array<string>>} - Returns an array of arrays where each sub-array contains items split by '##'.
 *
 * Example:
 * Input: "<div>{{##BUTTON##CHECKLIST##ELSOBA_CHKLST_020##Circuit Change}}</div>"
 * Output: [["BUTTON", "CHECKLIST", "ELSOBA_CHKLST_020", "Circuit Change"]]
 */
export function parseCurlyBraceContent(htmlString: string): Array<Array<string>> {
  const regex = /{{(.*?)}}/g;
  let matches = [...htmlString.matchAll(regex)];

  return matches.map(match => {
      let content = match[1].split('##').filter(item => item); // Split by '##' and remove empty items
      return content;
  });
}

/**
 * Function to parse an HTML string, extract content inside double curly braces, and replace it with HTML markup.
 * The content inside the double curly braces should be a string with items divided by '##'.
 * The function splits the content and replaces it with corresponding HTML button markup.
 *
 * @param {string} htmlString - The HTML string containing double curly braces with content to be parsed.
 * @returns {string} - Returns the updated HTML string with parsed curly brace content replaced with HTML markup.
 *
 * Example:
 * Input: "<div>{{##BUTTON##CHECKLIST##ELSOBA_CHKLST_020##Circuit Change}}</div>"
 * Output: "<div><button type='button' id='ELSOBA_CHKLST_020' name='CHECKLIST'>Circuit Change</button></div>"
 */
export function parseAndReplaceCurlyBraceContent(htmlString: string): string {
  const regex: RegExp = /{{(.*?)}}/g;

  return htmlString.replace(regex, (match: string, p1: string): string => {
    // Split the content inside the curly braces by '##' and filter out any empty items
    const items: string[] = p1.split('##').filter(item => item);

    // Check if we have at least 4 items to form a valid HTML button
    if (items.length === 4) {
      const [component, nameType, id, label] = items;
      const constructIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M18.929 2.643c0-.592-.48-1.071-1.072-1.071H2.143a1.071 1.071 0 1 0 0 2.142H15.27L1.385 17.6A1.072 1.072 0 0 0 2.9 19.115L16.786 5.23v13.127a1.071 1.071 0 1 0 2.143 0z" clip-rule="evenodd"></path></svg>`;
      let constructStr = "";

      // Construct the HTML button markup
      if (component === "BUTTON") {
        constructStr = `<div class="blue-menu-item mxt-10">`;
        constructStr += `<button type='button' data-link='${nameType}##${id}' `;
        constructStr += `class="base-control base-button relative bg-transparent font-inherit color-inherit select-none mx-0 variant-blue width-100"`;
        constructStr += `>`;
        constructStr += `<span class="inner-base-button height-100 flex align-center justify-center px-20 justify-between align-start">`;
        
        // background
        constructStr += `<span class="ui-background pointer-none absolute lx-0 tx-0 width-100 height-100"></span>`;
        
        // label
        constructStr += `<span class="ui-body flex relative text-left mxr-20">`;
        constructStr += `<span class="ui-label transform-z">${label}</span>`;
        constructStr += `</span>`;       // ui-body/label

        // icon 
        constructStr += `<span class="ui-accessory-icon flex relative base-control">${constructIcon}</span>`;
        // if (nameType === "CHECKLIST") {}

        constructStr += `</span`;       // inner-base-button
        constructStr += `</button>`;
        constructStr += `</div>`;
        
        return constructStr;
      }
    }
    // If not valid, return the original match unchanged
    return match;
  });
}