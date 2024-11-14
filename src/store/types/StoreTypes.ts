/**
 * Typescript types for stores
 * 
 */
import { BranchViewData } from "@/types";


// PASS KEY /////////////////////
//////////////////////////////////////////
export interface IFormPassKeyData {
  passkey: string;
}

export interface IPassKeyState {
  authorized: boolean;
}


// NOTES /////////////////////
//////////////////////////////////////////
export type NotesDataType = {
  id?: string;
  textBlock?: string;
}

export interface INotesState {
  data: Record<string, NotesDataType>;
}


// CHECKLIST /////////////////////
//////////////////////////////////////////
export interface ICheckListState {
  data: Record<string, boolean>;
}


// FAVORITES /////////////////////
//////////////////////////////////////////
export interface IFavoriteDataItem {
  type: string;
  data: BranchViewData;
  parentData: BranchViewData;
}

export interface IFavoritesState {
  data: Record<string, IFavoriteDataItem>;
}