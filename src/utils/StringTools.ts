

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncateStringToValue(text: string, chars: number = 3) {
  // Check if the string is already number of chars or less
  if (text?.length <= chars) {
    return text;
  }

  // Return the first chars followed by "..."
  return text?.slice(0, chars) + '...';
}

export function parseHTMLStringAttributes(attributeString: string) {
  const regex = /(\w+)="([^"]+)"/g;
  const jsonObject = {} as Record<string, any>;
  let match;

  // Iterate over all matches of the regex
  while ((match = regex.exec(attributeString)) !== null) {
    const key = match[1];
    const value = match[2];
    jsonObject[key] = value;
  }

  return jsonObject;
}

export function copyToClipboard(text: string) {
  
  return new Promise<boolean>((resolve) => {

    try {
      navigator.clipboard.writeText(text)
      .then(() => {
        // console.log('Text copied to clipboard');
        resolve(true);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        resolve(false);
      });
    }
    catch(e:any) {
      resolve(false);
    }
    
  })
}