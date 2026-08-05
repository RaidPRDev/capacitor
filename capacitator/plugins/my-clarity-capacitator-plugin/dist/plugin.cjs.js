'use strict';

var core = require('@capacitor/core');

const MyClarityCapacitator = core.registerPlugin('MyClarityCapacitator', {
    web: () => Promise.resolve().then(function () { return web; }).then((m) => new m.MyClarityCapacitatorWeb()),
});

class MyClarityCapacitatorWeb extends core.WebPlugin {
    async initialize(options) {
        // console.log('[CLARITY].initialize', options);
        return options;
    }
    async setCurrentScreenName(options) {
        // console.log('[CLARITY].setCurrentScreenName', options);
        return options;
    }
    async echo(options) {
        // console.log('[CLARITY].echo', options);
        return options;
    }
}

var web = /*#__PURE__*/Object.freeze({
    __proto__: null,
    MyClarityCapacitatorWeb: MyClarityCapacitatorWeb
});

exports.MyClarityCapacitator = MyClarityCapacitator;
//# sourceMappingURL=plugin.cjs.js.map
