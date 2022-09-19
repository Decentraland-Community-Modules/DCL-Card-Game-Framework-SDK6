import { Eth } from 'web3x/eth';
import { EthereumProvider } from 'web3x/providers';
export declare type SavedBlock = {
    number: number;
    timestamp: number;
};
export declare type BlockResponse = {
    block: number;
    timestamp: number;
};
export default class Blocks {
    eth: Eth;
    checkedBlocks: {
        [key: string]: number[];
    };
    saveBlocks: boolean;
    savedBlocks: {
        [key: string]: SavedBlock;
    };
    requests: number;
    blockTime?: number;
    firstTimestamp?: number;
    constructor(eth: EthereumProvider, save?: boolean);
    fillBlockTime(): Promise<void>;
    getDate(date: number, after?: boolean): Promise<BlockResponse>;
    findBetter(date: number, predictedBlock: SavedBlock, after: boolean, blockTime?: number): any;
    isBetterBlock(date: number, predictedBlock: SavedBlock, after: boolean): Promise<boolean>;
    getNextBlock(date: number, currentBlock: number, skip: number): any;
    getBlockWrapper(block: number | string): Promise<SavedBlock>;
}
