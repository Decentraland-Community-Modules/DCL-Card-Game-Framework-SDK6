/// <reference types="node" />
import { Address } from '../address';
import { Eth, SendTx } from '../eth';
import { ContractAbi, ContractFunctionEntry } from './abi';
import { DefaultOptions, SendOptions, Tx } from './tx';
export declare class TxDeploy extends Tx {
    private deployData;
    private onDeployed;
    constructor(eth: Eth, contractEntry: ContractFunctionEntry, contractAbi: ContractAbi, deployData: Buffer, args?: any[], defaultOptions?: DefaultOptions, onDeployed?: (address: Address) => void);
    send(options: SendOptions): SendTx;
    encodeABI(): Buffer;
}
