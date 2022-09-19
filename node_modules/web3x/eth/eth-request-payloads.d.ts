import { Address } from '../address';
import { CallRequest, EstimateRequest, fromRawBlockResponse, fromRawTransactionReceipt, fromRawTransactionResponse, LogRequest, outputBigNumberFormatter, outputSyncingFormatter, PartialTransactionRequest, RawLogResponse, TransactionRequest } from '../formatters';
import { TransactionHash } from '../types';
import { Data } from '../types';
import { hexToNumber } from '../utils';
import { BlockHash, BlockType } from './block';
import { SignedTransaction } from './signed-transaction';
export declare class EthRequestPayloads {
    defaultFromAddress?: Address | undefined;
    private defaultBlock;
    constructor(defaultFromAddress?: Address | undefined, defaultBlock?: BlockType);
    getDefaultBlock(): BlockType;
    setDefaultBlock(block: BlockType): void;
    getId(): {
        method: string;
        format: typeof hexToNumber;
    };
    getNodeInfo(): {
        method: string;
        format: (result: string) => string;
    };
    getProtocolVersion(): {
        method: string;
        format: (result: string) => string;
    };
    getCoinbase(): {
        method: string;
        format: typeof Address.fromString;
    };
    isMining(): {
        method: string;
        format: (result: boolean) => boolean;
    };
    getHashrate(): {
        method: string;
        format: typeof hexToNumber;
    };
    isSyncing(): {
        method: string;
        format: typeof outputSyncingFormatter;
    };
    getGasPrice(): {
        method: string;
        format: typeof outputBigNumberFormatter;
    };
    getAccounts(): {
        method: string;
        format: (result: string[]) => Address[];
    };
    getBlockNumber(): {
        method: string;
        format: typeof hexToNumber;
    };
    getBalance(address: Address, block?: BlockType): {
        method: string;
        params: (string | undefined)[];
        format: typeof outputBigNumberFormatter;
    };
    getStorageAt(address: Address, position: string, block?: BlockType): {
        method: string;
        params: (string | undefined)[];
        format: (result: string) => string;
    };
    getCode(address: Address, block?: BlockType): {
        method: string;
        params: (string | undefined)[];
        format: (result: string) => string;
    };
    getBlock(block: BlockType | BlockHash, returnTransactionObjects?: boolean): {
        method: string;
        params: (string | boolean | undefined)[];
        format: typeof fromRawBlockResponse;
    };
    getUncle(block: BlockType | BlockHash, uncleIndex: number, returnTransactionObjects?: boolean): {
        method: string;
        params: (string | boolean | undefined)[];
        format: typeof fromRawBlockResponse;
    };
    getBlockTransactionCount(block: BlockType | BlockHash): {
        method: string;
        params: (string | undefined)[];
        format: typeof hexToNumber;
    };
    getBlockUncleCount(block: BlockType | BlockHash): {
        method: string;
        params: (string | undefined)[];
        format: typeof hexToNumber;
    };
    getTransaction(hash: TransactionHash): {
        method: string;
        params: string[];
        format: typeof fromRawTransactionResponse;
    };
    getTransactionFromBlock(block: BlockType | BlockHash, index: number): {
        method: string;
        params: (string | undefined)[];
        format: typeof fromRawTransactionResponse;
    };
    getTransactionReceipt(hash: TransactionHash): {
        method: string;
        params: string[];
        format: typeof fromRawTransactionReceipt;
    };
    getTransactionCount(address: Address, block?: BlockType): {
        method: string;
        params: (string | undefined)[];
        format: typeof hexToNumber;
    };
    signTransaction(tx: TransactionRequest): {
        method: string;
        params: import("../formatters").RawTransactionRequest[];
        format: (result: SignedTransaction) => SignedTransaction;
    };
    sendSignedTransaction(data: Data): {
        method: string;
        params: string[];
        format: (result: string) => string;
    };
    sendTransaction(tx: PartialTransactionRequest): {
        method: string;
        params: import("../formatters").RawTransactionRequest[];
        format: (result: string) => string;
    };
    sign(address: Address, dataToSign: Data): {
        method: string;
        params: any[];
        format: (result: string) => string;
    };
    signTypedData(address: Address, dataToSign: {
        type: string;
        name: string;
        value: string;
    }[]): {
        method: string;
        params: (string | {
            type: string;
            name: string;
            value: string;
        }[])[];
        format: (result: string) => string;
    };
    call(tx: CallRequest, block?: BlockType): {
        method: string;
        params: (string | import("../formatters").RawCallRequest | undefined)[];
        format: (result: string) => string;
    };
    estimateGas(tx: EstimateRequest): {
        method: string;
        params: import("../formatters").RawEstimateRequest[];
        format: typeof hexToNumber;
    };
    submitWork(nonce: string, powHash: string, digest: string): {
        method: string;
        params: string[];
        format: (result: boolean) => boolean;
    };
    getWork(): {
        method: string;
        format: (result: string[]) => string[];
    };
    getPastLogs(options: LogRequest): {
        method: string;
        params: import("../formatters").RawLogRequest[];
        format: (result: RawLogResponse[]) => import("../formatters").LogResponse[];
    };
    private resolveBlock;
}
