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