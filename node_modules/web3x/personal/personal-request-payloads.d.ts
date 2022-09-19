/// <reference types="node" />
import { Address } from '../address';
import { TransactionRequest } from '../formatters';
export interface Transaction extends TransactionRequest {
    condition?: {
        block: number;
    } | {
        time: number;
    } | null;
}
export interface SignedTransaction {
    raw: string;
    tx: Transaction;
}
export declare class PersonalRequestPayloads {
    getAccounts(): {
        method: string;
        format: (result: string[]) => Address[];
    };
    newAccount(password: string): {
        method: string;
        params: string[];
        format: typeof Address.fromString;
    };
    unlockAccount(address: Address, password: string, duration: number): {
        method: string;
        params: (string | number)[];
        format: (result: boolean) => boolean;
    };
    lockAccount(address: Address): {
        method: string;
        params: string[];
        format: (result: void) => void;
    };
    importRawKey(privateKey: Buffer, password: string): {
        method: string;
        params: string[];
        format: typeof Address.fromString;
    };
    sendTransaction(tx: Transaction, password: string): {
        method: string;
        params: (string | {
            condition: {
                block: number;
            } | {
                time: number;
            } | null | undefined;
            from: string;
            to?: string | undefined;
            gas?: string | undefined;
            gasPrice?: string | undefined;
            value?: string | undefined;
            data?: string | undefined;
            nonce?: string | undefined;
        })[];
        format: (result: string) => string;
    };
    signTransaction(tx: Transaction, password: string): {
        method: string;
        params: (string | {
            condition: {
                block: number;
            } | {
                time: number;
            } | null | undefined;
            from: string;
            to?: string | undefined;
            gas?: string | undefined;
            gasPrice?: string | undefined;
            value?: string | undefined;
            data?: string | undefined;
            nonce?: string | undefined;
        })[];
        format: (result: SignedTransaction) => SignedTransaction;
    };
    sign(message: string, address: Address, password: string): {
        method: string;
        params: any[];
        format: (result: string) => string;
    };
    ecRecover(message: string, signedData: string): {
        method: string;
        params: any[];
        format: typeof Address.fromString;
    };
}
