import { Eth } from '../eth';
export declare class Net {
    private eth;
    private request;
    constructor(eth: Eth);
    private send;
    getId(): Promise<number>;
    isListening(): Promise<boolean>;
    getPeerCount(): Promise<number>;
    getNetworkType(): Promise<"private" | "main" | "morden" | "ropsten" | "rinkeby" | "kovan">;
}
