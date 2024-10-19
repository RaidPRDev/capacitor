export async function loadJSONFile(url: string) {
  
  return new Promise<any>(async (resolve) => {
    try {
      const response = await fetch(`${url}`);
      if (!response.ok) {
        throw new Error(`Failed to load data from ${url}`);
      }
      const data = await response.json();
  
      resolve(data);
  
    } catch (error) {
  
      console.error(error);
      throw new Error(`Failed to load data from ${url}`);
  
    } 
  })
}

export async function loadHTMLFile(url: string) {
  
  return new Promise<any>(async (resolve) => {
    try {
      const response = await fetch(`${url}`);
      if (!response.ok) {
        throw new Error(`Failed to load html from ${url}`);
      }
      
      const data = await response.text();
  
      resolve(data);
  
    } catch (error) {
  
      console.error(error);
      throw new Error(`Failed to load html from ${url}`);
  
    } 
  })
}