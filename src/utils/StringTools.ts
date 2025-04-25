

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


/**
 * Checks whether a given string is likely a file path to an image.
 * 
 * Criteria:
 * - Contains at least one slash ("/" or "\\") to resemble a file path.
 * - Ends with a common image file extension: .png, .jpg, .gif, or .svg
 * 
 * @param input - The string to check.
 * @returns `true` if the string is a likely image file path, otherwise `false`.
 */
export function isImagePath(input: string): boolean {
  const hasSlash = /[\/\\]/.test(input);
  const hasImageExtension = /\.(png|jpg|jpeg|gif|svg)$/i.test(input);
  return hasSlash && hasImageExtension;
}


/**
 * removeDuplicateWords
 * ---------------------
 * Removes duplicate words from a given string while preserving the original order.
 * Comparison is case-insensitive by default.
 *
 * @param text - The input string containing words
 * @returns A new string with duplicate words removed
 */

export function removeDuplicateWords(text: string): string {
  const seen = new Set<string>();
  return text
    .split(/\s+/) // Split string into words by whitespace
    .filter(word => {
      const lowerWord = word.toLowerCase(); // Case-insensitive comparison
      if (seen.has(lowerWord)) return false;
      seen.add(lowerWord);
      return true;
    })
    .join(' ');
}

/**
 * Converts a labeled string (e.g., "A. Some text...") into an HTML list container.
 * If the string starts with a capital letter followed by a period (e.g., "A."), it splits the string into label and content.
 * Returns HTML string with two <div> elements inside a flex container.
 *
 * @param input - The input string to convert.
 * @returns An HTML string representing the parsed label/content structure.
 */
export function parseLabelToListFormat(input: string): string {
  const match = input.match(/^([A-Z]\.)\s+(.*)/);

  if (match) {
    const label = match[1];
    const content = match[2];
    return `<div class="flex gapx-10"><div>${label}</div><div>${content}</div></div>`;
  } else {
    // If no label like "A.", "B.", etc. is found, return the input in a single div
    return `${input}`;
  }
}