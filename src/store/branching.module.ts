import { defineStore } from 'pinia';

interface IRouterFrom {
  fullPath?: string;
  params?: { id?: string };
  path?: string;
}

interface IRefferedBranchView {
  id?: string;
  dataType?: string;
  title?: string;
  subTitle?: string;
  fullPath?: string;
}

interface IBranchingStore {
  routerFrom?: IRouterFrom | null;
  refferedView: IRefferedBranchView | null;
}

const initialState: IBranchingStore = {
  routerFrom: null,
  refferedView: null,
};

export const useBranchingStore = defineStore('branching', {
  persist: true,

  state: () => initialState,

  getters: {
    getReferredView: (state) => state.refferedView,
  },

  actions: {
    initSession() {
      this.refferedView = {}   
    },

    setReferredView(some: any) {
      this.refferedView = some;
    },
  }

});

export default useBranchingStore;