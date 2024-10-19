import { defineStore } from 'pinia';
import { IFormPassKeyData, IPassKeyState } from '@/store/types/StoreTypes';

const initialState: IPassKeyState = {
  authorized: false
};

const PASSKEY = "@elso_app";

export const usePassKey = defineStore('passkey', {
  persist: true,
  
  state: () => initialState,

  getters: {
    isAuthorized: (state) => state.authorized,
  },

  actions: {
    /**
     * Authorize Access To App
     * @returns
     */
    async authorize(formData: IFormPassKeyData) {
      
      if (formData.passkey === PASSKEY) {
        this.authorized = true;
        return true;
      }

      return false;
    },

  },
});

export default usePassKey;
