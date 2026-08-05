import { WebPlugin } from '@capacitor/core';

import type { MyClarityCapacitatorPlugin } from './definitions';

export class MyClarityCapacitatorWeb extends WebPlugin implements MyClarityCapacitatorPlugin {
  async initialize(options: { id: string }): Promise<{ id: string }> {
    // console.log('[CLARITY].initialize', options);
    return options;
  }
  async setCurrentScreenName(options: { id: string }): Promise<{ id: string }> {
    // console.log('[CLARITY].setCurrentScreenName', options);
    return options;
  }
  async echo(options: { value: string }): Promise<{ value: string }> {
    // console.log('[CLARITY].echo', options);
    return options;
  }
}
