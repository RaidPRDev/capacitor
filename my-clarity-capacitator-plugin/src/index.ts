import { registerPlugin } from '@capacitor/core';

import type { MyClarityCapacitatorPlugin } from './definitions';

const MyClarityCapacitator = registerPlugin<MyClarityCapacitatorPlugin>('MyClarityCapacitator', {
  web: () => import('./web').then((m) => new m.MyClarityCapacitatorWeb()),
});

export * from './definitions';
export { MyClarityCapacitator };
