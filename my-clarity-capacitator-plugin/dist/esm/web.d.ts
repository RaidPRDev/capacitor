import { WebPlugin } from '@capacitor/core';
import type { MyClarityCapacitatorPlugin } from './definitions';
export declare class MyClarityCapacitatorWeb extends WebPlugin implements MyClarityCapacitatorPlugin {
    initialize(options: {
        id: string;
    }): Promise<{
        id: string;
    }>;
    setCurrentScreenName(options: {
        id: string;
    }): Promise<{
        id: string;
    }>;
    echo(options: {
        value: string;
    }): Promise<{
        value: string;
    }>;
}
