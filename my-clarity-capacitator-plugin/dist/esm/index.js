import { registerPlugin } from '@capacitor/core';
const MyClarityCapacitator = registerPlugin('MyClarityCapacitator', {
    web: () => import('./web').then((m) => new m.MyClarityCapacitatorWeb()),
});
export * from './definitions';
export { MyClarityCapacitator };
//# sourceMappingURL=index.js.map