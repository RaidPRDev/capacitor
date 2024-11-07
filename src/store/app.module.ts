import { defineStore } from 'pinia';

interface IAppStore {
  currentViewID?: string;  
}

const initialState: IAppStore = {
  currentViewID: ``,
};

export const useAppStore = defineStore('app_store', {
  persist: true,

  state: () => initialState,

  getters: {
    getCurrentID: (state) => state.currentViewID,
  },

  actions: {
    setCurrentID(id: string) {
      this.currentViewID = id;
    },
  }

});

export default useAppStore;