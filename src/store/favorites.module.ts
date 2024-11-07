import { defineStore } from 'pinia';
import { IFavoriteDataItem, IFavoritesState } from '@/store/types/StoreTypes';

const initialState: IFavoritesState = {
  data: {}
};

export const useFavoritesStore = defineStore('favorites', {
  persist: true,
  
  state: () => initialState,

  getters: {},

  actions: {
    getItem(id: string) {
      if (this.data?.[id]) return this.data?.[id];
      return null;
    },
    setItem(payload: IFavoriteDataItem) {
      this.data[payload.data.id!] = payload;
    },
    removeItem(id: string) {
      delete this.data?.[id!];
      return true;
    },
    clearItems() {
      // console.log("Clear Favorites");
      this.data = {}
    },

  },
});

export default useFavoritesStore;
