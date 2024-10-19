import { capitalizeFirstLetter } from '@/utils/StringTools';
import { defineStore } from 'pinia';

const APP_VERSION = import.meta.env.APP_VERSION;
const BUILD_VERSION = import.meta.env.BUILD_VERSION;
const BUILD_PHASE = import.meta.env.BUILD_PHASE;
const PLATFORM_NAME = capitalizeFirstLetter(import.meta.env.PLATFORM);

interface ISession {
  appVersion?: string;
  buildVersion?: string;
  buildPhase?: string;
  currentIndex?: number;
  loggedIn: boolean;
  hasCompletedPrivacy: boolean;
  hasCompletedTerms: boolean;
}

const initialState: ISession = {
  appVersion: APP_VERSION,
  buildVersion: BUILD_VERSION,
  buildPhase: BUILD_PHASE,
  currentIndex: 0,
  loggedIn: false,
  hasCompletedPrivacy: false,
  hasCompletedTerms: false,

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
    getPrivacy: (state) => state.hasCompletedPrivacy
  },

  actions: {
    initSession() {
      if (this.appVersion !== APP_VERSION) {
        console.log("App Version update found.");
      }
      if (this.buildVersion !== BUILD_VERSION) {
        console.log("Build Version update found.");
      }
      if (this.buildPhase !== BUILD_PHASE) {
        console.log("Build Phase update found.");
      }      
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

    /**
     * Set incoming user date to state
     * @returns
     */
    setUser(payload: ISession) {
      if (!payload.loggedIn) {
        this.loggedIn = true;
      }
      else this.loggedIn = payload.loggedIn;
    },
    
    /**
     * Clear user state
     * @returns
     */
    resetUser() {
      this.loggedIn = false;
    },
  }

});

export default useSession;