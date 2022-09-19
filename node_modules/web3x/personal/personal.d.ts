/// <reference types="node" />
import { Address } from '../address';
import { EthereumProvider } from '../providers/ethereum-provider';
import { PersonalRequestPayloads, Transaction } from './personal-request-payloads';
export declare class Personal {
    private provider;
    readonly request: PersonalRequestPayloads;
    constructor(provider: EthereumProvider);
    private send;
    getAccounts(): Promise<Address[]>;
    newAccount(password: string): Promise<Address>;
    unlockAccount(address: Address, password: string, duration: number): Promise<boolean>;
    lockAccount(address: Address): Promise<void>;
    importRawKey(privateKey: Buffer, password: string): Promise<Address>;
    sendTransaction(tx: Transaction, password: string): Promise<string>;
    signTransaction(tx: Transaction, password: string): Promise<import("./personal-request-payloads").SignedTransaction>;
    sign(message: string, address: Address, password: string): Promise<string>;
    ecRecover(message: string, signedData: string): Promise<Address>;
}
