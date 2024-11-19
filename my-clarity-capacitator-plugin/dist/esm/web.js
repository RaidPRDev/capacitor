import { WebPlugin } from '@capacitor/core';
export class MyClarityCapacitatorWeb extends WebPlugin {
    async initialize(options) {
        console.log('[CLARITY].initialize', options);
        return options;
    }
    async setCurrentScreenName(options) {
        console.log('[CLARITY].setCurrentScreenName', options);
        return options;
    }
    async echo(options) {
        console.log('[CLARITY].echo', options);
        return options;
    }
}
//# sourceMappingURL=web.js.map