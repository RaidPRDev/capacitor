import { defineStore } from 'pinia';
import { ICheckListState } from '@/store/types/StoreTypes';

const initialState: ICheckListState = {
  data: {}
};

export const useChecklistStore = defineStore('checklists', {
  persist: true,
  
  state: () => initialState,

  getters: {},

  actions: {
    setChecklistItem(payload: any) {
      this.data[payload.id] = payload.value;
    },
  },
});

export default useChecklistStore;
