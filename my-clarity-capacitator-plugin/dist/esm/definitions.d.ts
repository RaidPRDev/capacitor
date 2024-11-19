export interface MyClarityCapacitatorPlugin {
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
