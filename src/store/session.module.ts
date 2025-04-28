import { capitalizeFirstLetter } from '@/utils/StringTools';
import { defineStore } from 'pinia';
import useChecklistStore from "@/store/checklist.module";
// import useFavoritesStore from "@/store/favorites.module";
import useBranchingStore from "@/store/branching.module";

const APP_VERSION = import.meta.env.APP_VERSION;
const BUILD_NUMBER = import.meta.env.BUILD_NUMBER;
const BUILD_PHASE = import.meta.env.BUILD_PHASE;
const PLATFORM_NAME = capitalizeFirstLetter(import.meta.env.PLATFORM);

export interface ISessionUser {
  firstName: string;  
  lastName: string;  
  email: string;  
  cellPhone: string;  
  country: string;  
  title: string;  
  credentials: string;  
  hospitalSystem: string;
}

interface ISession {
  appVersion?: string;
  buildVersion?: string;
  buildPhase?: string;
  currentIndex?: number;
  loggedIn: boolean;
  disclaimers: Array<{ id?:string }>;
  hasCompletedPrivacy: boolean;
  hasCompletedTerms: boolean;
  hasCompletedDisclaimer: boolean;
  hasCompletedMedDisclaimer: boolean;
  hasRegistered: boolean;
  user?: ISessionUser | null;
}

const initialState: ISession = {
  appVersion: APP_VERSION,
  buildVersion: BUILD_NUMBER,
  buildPhase: BUILD_PHASE,
  currentIndex: 0,
  loggedIn: false,
  disclaimers: [],
  hasCompletedPrivacy: false,
  hasCompletedTerms: false,
  hasCompletedDisclaimer: false,
  hasCompletedMedDisclaimer: false,
  hasRegistered: false,
  user: null
};

export const useSession = defineStore('session', {
  persist: true,

  state: () => initialState,

  getters: {
    hasLoggedIn: (state) => state.loggedIn,
    getPlatform: () => PLATFORM_NAME,
    getCurrentIndex: (state) => state.currentIndex,
    getAppVersion: (state) => state.appVersion,
    getBuildVersion: (state) => state.buildVersion,
    getBuildPhase: (state) => state.buildPhase,
    getTerms: (state) => state.hasCompletedTerms,
    getPrivacy: (state) => state.hasCompletedPrivacy,
    getDisclaimer: (state) => state.hasCompletedDisclaimer,
    getMedDisclaimer: (state) => state.hasCompletedMedDisclaimer,
    getDisclaimers: (state) => state.disclaimers
  },

  actions: {
    initSession() {
      // const favoritesStore = useFavoritesStore();
      const checklistStore = useChecklistStore();
      const branchingStore = useBranchingStore();

      if (this.appVersion !== APP_VERSION) {
        console.log("App Version update found.");
        this.$state.appVersion = APP_VERSION;
      }
      if (parseInt(this.buildVersion!) !== BUILD_NUMBER) {
        console.log("Build Version update found.");
        this.$state.buildVersion = BUILD_NUMBER;
        // favoritesStore.clearItems();
        checklistStore.clearItems();
        branchingStore.clearItems();
        this.$state.hasCompletedMedDisclaimer = false;
        this.$state.hasCompletedDisclaimer = false;
        this.$state.hasCompletedTerms = false;
        this.$state.hasCompletedPrivacy = false;
        this.$state.disclaimers = [];
      }
      if (this.buildPhase !== BUILD_PHASE) {
        console.log("Build Phase update found.");
        this.$state.buildPhase = BUILD_PHASE;
      }      
    },

    findDisclaimer(id: string) {

      const disclaimer = this.disclaimers.find((item) => {
        if (item.id === id) return true;
        return false;
      });

      return disclaimer !== undefined
    },

    setAppVersion(version: string) {
      this.appVersion = version;
    },
    
    setBuildVersion(version: string) {
      this.buildVersion = version;
    },
    
    setBuildPhase(phase: string) {
      this.buildPhase = phase;
    },

    setCurrentIndex(index: number) {
      this.currentIndex = index;
    },

    setUser(payload: ISessionUser) {
      this.user = payload;
    },
    
    /**
     * Clear user state
     * @returns
     */
    resetUser() {
      this.user = null;
    },
  }

});

export default useSession;