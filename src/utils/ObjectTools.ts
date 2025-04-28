export function isObjectEmpty(obj:any) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function flattenChecklist(items: any, level: number = 1, checklistData:any) {
  const result = [] as any[];

  items.forEach((item:any) => {
    
    // Copy the item and add the class based on the current level
    const flattenedItem = { ...item, class: `sub-level-${level}` };

    if (item.class) {
      flattenedItem.class = `${flattenedItem.class} ${item.class}`;
    }

    if (checklistData) {
      if (checklistData.value?.hasOwnProperty(item.id!)) {
        if (item.hasOwnProperty('checked')) {
          flattenedItem.checked = checklistData.value?.[item.id!];
        }
        // else if (item?.layout === "checklist" && item.hasOwnProperty('items')) {
        //   flattenedItem.checked = checklistData.value?.[item.id!];
        // }
      }
    }

    if (item.type === 'subchecklist' && item.items && item.items.length > 0) {
      flattenedItem.isRootParent = true;
    }

    result.push(flattenedItem);

    // If the item has a 'subchecklist' type and contains nested items, process them
    if (item.type === 'subchecklist' && item.items && item.items.length > 0) {
      result.push(...flattenChecklist(item.items, level + 1, checklistData));
    }
  });

  return result;
}

export type ChecklistCountType = {
  completed: number,
  total: number
}

export function checklistItemCountCompleteCheck(items: any, counter: ChecklistCountType, checklistData:any) {
  items.forEach((item:any) => {
    if (item.hasOwnProperty('checked')) {
      counter.total++;
      if (checklistData.value?.hasOwnProperty(item.id!)) {
        if (checklistData.value[item.id!]) counter.completed++;
      }
    }

    // If the item has a 'subchecklist' type and contains nested items, process them
    if (item.type === 'subchecklist' && item.items && item.items.length > 0) {
      counter = checklistItemCountCompleteCheck(item.items, counter, checklistData)
    }
  });
  return counter;
}

export function iterateArray(arr:Array<any> = [], parent: Record<string, any> | null = null, callback?:Function) {
  arr.forEach((item, index) => {

      if (item?.type === "sublevel2checklist") {
        if (Array.isArray(item.items) && item.items.length > 0) {
          // Pass the current item as the parent
          iterateArray(item.items, item, callback);
          return;
        }
      }

      if (callback) {
        //console.error("CALLBACK")
        callback(item, index, parent);
      }
      
      if (Array.isArray(item.items) && item.items.length > 0) {
        // Pass the current item as the parent
        iterateArray(item.items, item, callback);
        return;
      }
  });
}

export function sortItemsByProperty(items: any, property: string, order: "asc" | "desc" = "asc") {
  return items.sort((a:any, b:any) => {
    const titleA = a?.data?.[property]?.toUpperCase(); // Ignore case
    const titleB = b?.data?.[property]?.toUpperCase(); // Ignore case

    if (titleA < titleB) {
      if (order === "asc") return -1; // A comes before B
      else return 1;
    }
    if (titleA > titleB) {
      if (order === "asc") return 1; // A comes before B
      else return -1;
    }

    return 0; // Titles are equal
  });
}

export function sortItemsByClassDisabled(items: any) {
  return items.sort((a: any, b: any) => {
    // If 'a' is disabled and 'b' is not, sort 'a' after 'b'
    if (a.class === "disabled" && b.class !== "disabled") {
      return 1;
    }
    // If 'b' is disabled and 'a' is not, sort 'b' after 'a'
    if (b.class === "disabled" && a.class !== "disabled") {
      return -1;
    }
    // If both items are disabled or both are not, maintain original order
    return 0;
  });
}

export function sortObjectByKeys(obj:any) {
  const sortedKeys = Object.keys(obj).sort((a, b) => {
    const keyA = a.toUpperCase(); // Ignore case
    const keyB = b.toUpperCase(); // Ignore case

    if (keyA < keyB) {
      return -1; // A comes before B
    }
    if (keyA > keyB) {
      return 1; // A comes after B
    }

    return 0; // Keys are equal
  });

  const sortedObj:any = {};
  sortedKeys.forEach(key => {
    sortedObj[key] = obj[key]; // Rebuild the object with sorted keys
  });

  return sortedObj;
}