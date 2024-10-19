import { defineStore } from 'pinia';
import { IToaster, IToasterServiceState } from './types';

const initialState: IToasterServiceState = {
  toasts: [],
  positions: []
};

export const useNotifyStore = defineStore('app_toaster', {
  persist: false,
  
  state: () => initialState,

  getters: {},

  actions: {
    
    addToast(data: IToaster) {
      const index = this.toasts?.length! + 1;
      data.id = (Math.random() * (999 - 199) + 199) * Date.now();
      data.index = index;
      this.toasts?.push(data);
      this.positions?.push(index);
      return true;
    },

    removeToast(data: IToaster) {
      // get index position
      const thisIndex = this.positions?.findIndex((item) => item === data?.index)
      this.positions?.splice(thisIndex!, 1);
      return true;
    },

  },
});

export default useNotifyStore;
