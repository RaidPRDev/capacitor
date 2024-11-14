import { BranchViewData, BranchViewParamData } from "@/types";

/**
 * 
 * @param data 
 * @param id 
 * @returns 
 */
export function findBranchParents(data:Array<BranchViewData>, id:any) {
  const result = [] as Array<BranchViewData>;
  
  function recursiveSearch(currentId:any) {
    const node = data.find(item => item.id === currentId) as BranchViewData;
    
    if (!node) return false; // Stop if no node is found

    // Add the current node to the result
    result.unshift(node);
    
    // Check if this node has any parent (by checking if it appears as `branchTo` elsewhere)
    for (let item of data) {
      if (item?.items?.some(branch => branch.branchTo === currentId)) {
        recursiveSearch(item.id);
      }
    }
  }
  
  // Start the search with the given id
  recursiveSearch(id);

  // Ensure the root node (first item) is always included
  if (!result.some(node => node?.isRootParent)) {
    const root = data.find(node => node?.isRootParent);
    result.unshift(root!);
  }
  
  return result;
}

export function getNavigationRoot(params: BranchViewParamData) {
  
  if (!params?.view) {
    // console.log(`getNavigationRoot`, params);
    return { isPreviousRoot: false, isViewRoot: false }
  }

  const isViewRoot = params.view && params.view.hasOwnProperty("isRootParent");
  let isPreviousRoot = params.previousView.hasOwnProperty("isRootParent") ? params.previousView.isRootParent : false;

  
  if (params.previousView?.id === params.view.id) {
    isPreviousRoot = false;
  }
  else {
    if (isPreviousRoot === null) {
      isPreviousRoot = false;
    }
  }
  return { isPreviousRoot, isViewRoot }
}