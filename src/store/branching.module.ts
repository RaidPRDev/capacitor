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
  refferedViews: Array<IRefferedBranchView> | null;
}

const initialState: IBranchingStore = {
  routerFrom: null,
  refferedViews: null,
};

export const useBranchingStore = defineStore('branching', {
  persist: true,

  state: () => initialState,

  actions: {
    initSession() {
      this.refferedViews = null;
    },

    addReferrallView(view: any) {
      if (!this.refferedViews) this.refferedViews = []
      
      this.refferedViews.push(view);
    },
    
    removeLastReferrallView() {
      if (!this.refferedViews) return;
      
      const view = this.refferedViews.pop();
      if (this.refferedViews?.length === 0) {
        this.refferedViews = null;
      }

      return view;
    },
    
    removeAllReferralViews() {
      this.refferedViews = null;
    },

    getCurrentReferredView() {
      if (!this.refferedViews) return null;
      if (this.refferedViews.length === 0) return null;

      return this.refferedViews[this.refferedViews.length - 1];
    },
  }

});

export default useBranchingStore;