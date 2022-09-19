import { Address } from '../address';
import { Eth } from '../eth';
import { TransactionReceipt } from '../formatters';
import { TransactionHash } from '../types';
import { ContractAbi } from './abi';
import { Contract } from './contract';
import { SentContractTx } from './sent-contract-tx';
export declare class SentDeployContractTx extends SentContractTx {
    private onDeployed;
    constructor(eth: Eth, contractAbi: ContractAbi, promise: Promise<TransactionHash>, onDeployed: (address: Address) => void);
    protected handleReceipt(receipt: TransactionReceipt): Promise<TransactionReceipt<void>>;
    getContract(): Promise<Contract<void>>;
}
