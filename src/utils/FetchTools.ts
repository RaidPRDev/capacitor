/*
// urlFetch example code:

const API_CLIENT_ID = "iWtB7UWURISuhWODYJ6eljsHsQeHJPUW";
const _url = `https://bedsideguideapp.elso.org/api/jwt`;

const _reqInit:RequestInit = {
  headers: new Headers({ 
    "Content-Type": `text/plain`, 
    "clientId": `${API_CLIENT_ID}` 
  }),
  method: "GET",
  body: JSON.stringify({})
}

const _fetch = await urlFetch(_url, _reqInit as RequestInit) as {
  data?: any & {
    
  }, error?: string
};
console.log("FETCH", _fetch);

if (_fetch?.error && !isObjectEmpty(_fetch?.error)) {
  return;
}

if (!_fetch?.data) {
  return;
}

*/

export async function urlFetch(
  url: string,
  options: RequestInit,
  response: { type: "json" | "text" | "binary" } = { type: "json" }
): Promise<Record<string, any>> {
  let __data: any | null = null;
  let __fetch: any = null;
  try {
    
    __fetch = await fetch(url, options);
    
    if (response.type === "json") __data = await __fetch.json();
    else if (response.type === "text") __data = await __fetch.text();
    // else __data = await __fetch.blob();
    else {
      //resolve(__fetch.blob());
      //return;
    }
    
  } catch (e) {
    
    if (typeof e === "string") {
      __data = { error: e };
    } else if (e instanceof Error) {
      __data = { error: (e as Error).message };
    }
  }

  return new Promise<any>(async (resolve) => {
    
    if (response.type === "binary") {
      const contentType = __fetch.headers.get('content-type'); // Pass the content type dynamically
      const imageBuffer = await __fetch.arrayBuffer();

      resolve({ imageBuffer, contentType });
      return;
    }

    if (__data?.error) resolve({ ...__data });
    else resolve({ data: __data, headers: __fetch.headers });
  });
}

export function timeout(ms:number, message?:string) {
  return new Promise(resolve => setTimeout(() => { message ? resolve({ message: message }) : resolve(undefined) }, ms));
}