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

interface IViewHistoryItem {
  id?: string;
  scrollPos: number;
}

interface IBranchingStore {
  routerFrom?: IRouterFrom | null;
  refferedViews: Array<IRefferedBranchView> | null;
  viewHistory?: Record<string, IViewHistoryItem> | null;
}

const initialState: IBranchingStore = {
  routerFrom: null,
  refferedViews: null,
  viewHistory: null
};

export const useBranchingStore = defineStore('branching', {
  persist: true,

  state: () => initialState,

  actions: {
    initSession() {
      this.refferedViews = null;
    },

    addViewHistory(view: IViewHistoryItem) {
      if (!this.viewHistory) this.viewHistory = {}
      this.viewHistory[view.id!] = { scrollPos: view.scrollPos };
    },
    
    getViewHistoryByID(id: string) {
      if (this.viewHistory && this.viewHistory.hasOwnProperty(id)) return this.viewHistory[id];
      return null;
    },

    resetViewHistory() {
      this.viewHistory = {}
    },

    addReferrallView(view: IRefferedBranchView) {
      if (!this.refferedViews) this.refferedViews = []
      
      this.refferedViews.push(view);
    },
    
    removeLastReferrallView() {
      if (!this.refferedViews) return;
      
      const view = this.refferedViews.pop();
      // this.lastScrollPos = view?.scrollPos;
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

    clearItems() {
      // console.log("Clear Checklists");
      this.refferedViews = null;
    },
  }

});

export default useBranchingStore;