import { defineStore } from 'pinia';

interface ISession {
  currentIndex?: number;
}

const initialState: ISession = {
  currentIndex: 0
};



export const useSession = defineStore('session', {
  state: () => initialState,

  getters: {
    getCurrentIndex: (state) => state.currentIndex
  },

  actions: {
    setCurrentIndex(index: number) {
      this.currentIndex = index;
    }
  }

});

export default useSession;