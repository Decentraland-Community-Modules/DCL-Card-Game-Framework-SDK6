import { Eth, SentTransaction } from '../eth';
import { TransactionReceipt } from '../formatters';
import { TransactionHash } from '../types';
import { ContractAbi } from './abi';
export declare class SentContractTx extends SentTransaction {
    protected contractAbi: ContractAbi;
    constructor(eth: Eth, contractAbi: ContractAbi, promise: Promise<TransactionHash>);
    protected handleReceipt(receipt: TransactionReceipt): Promise<TransactionReceipt<void>>;
}
