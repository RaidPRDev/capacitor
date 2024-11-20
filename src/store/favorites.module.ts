import { defineStore } from 'pinia';
import { IFavoriteDataItem, IFavoritesState } from '@/store/types/StoreTypes';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

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
    async setItem(payload: IFavoriteDataItem) {
      Haptics.notification({ type: NotificationType.Success  });

      this.data[payload.data.id!] = payload;
    },
    removeItem(id: string) {
      Haptics.impact({ style: ImpactStyle.Heavy });
      
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
