/**
 * 
 * @param element 
 * @param className 
 * @returns 
 */
export function findParentByClassName(element: HTMLElement, className: string):HTMLElement | null {
  // Start with the current element's parent
  let currentElement = element.parentElement;

  // Iterate through parent elements until a match is found or no more parents
  while (currentElement !== null) {
      
    if (currentElement.classList.contains(className)) {
      return currentElement;
    }
    currentElement = currentElement.parentElement;
  }

  // Return null if no matching parent element is found
  return null;
}
