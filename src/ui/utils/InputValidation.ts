
export interface IErrorFieldProps {
  hasError: boolean;                          // enabled or not
  id: string | undefined;                     // unique identifier
  message: string;                            // text message
  warning?: string;                           // warning message, provided from password complexity 
  index?: number;                             // list index
  required?: boolean;                         // flag to check if required
  items?: Array<IErrorFieldProps>;            // items is used for any interaction elements within parent error
}

export interface IErrorFields {
  [key:string]: IErrorFieldProps;
}

export function findUnique(str:string)
{
  // The variable that contains the unique values
  let uniq = "";
   
  for(let i = 0; i < str.length; i++){
    // Checking if the uniq contains the character
    if(uniq.includes(str[i]) === false){
      // If the character not present in uniq
      // Concatenate the character with uniq
      uniq += str[i]
    }
  }
  return uniq;
}
