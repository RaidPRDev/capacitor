import { defineStore } from 'pinia';
import { INotesState, NotesDataType } from './types/StoreTypes';

const DEFAULT_NOTE_ID = "UID_NOTE##000";

const initialState: INotesState = {
  data: { 
    [DEFAULT_NOTE_ID]: {
      id: DEFAULT_NOTE_ID,
      textBlock: ""
    } 
  }
};

export const useFavoritesStore = defineStore('notes', {
  persist: true,
  
  state: () => initialState,

  getters: {},

  actions: {
    getItem(id: string) {
      if (this.data?.[id]) return this.data?.[id];
      return null;
    },
    setItem(payload: NotesDataType) {
      this.data[payload.id!] = payload;
    },
    removeItem(id: string) {
      delete this.data?.[id!];
      return true;
    },

  },
});

export default useFavoritesStore;
