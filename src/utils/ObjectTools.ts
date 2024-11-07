export function isObjectEmpty(obj:any) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function iterateArray(arr:Array<any> = [], parent: Record<string, any> | null = null, callback?:Function) {
  arr.forEach((item, index) => {
      // console.log(`ID: ${item.id}, Type: ${item.type}, Label: ${item.label}`);
      
      callback && callback(item, index, parent);

      if (Array.isArray(item.items) && item.items.length > 0) {
        // Pass the current item as the parent
        iterateArray(item.items, item, callback);
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