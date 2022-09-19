import { Address } from 'web3x/address';
import { TransactionReceipt } from 'web3x/formatters';
import { Contract, ContractOptions, TxCall } from 'web3x/contract';
import { Eth } from 'web3x/eth';
interface SignatureValidatorEvents {
}
interface SignatureValidatorEventLogs {
}
interface SignatureValidatorTxEventLogs {
}
export interface SignatureValidatorTransactionReceipt extends TransactionReceipt<SignatureValidatorTxEventLogs> {
}
interface SignatureValidatorMethods {
    isValidSignature(hash: string, _signature: string): TxCall<string>;
}
export interface SignatureValidatorDefinition {
    methods: SignatureValidatorMethods;
    events: SignatureValidatorEvents;
    eventLogs: SignatureValidatorEventLogs;
}
export declare class SignatureValidator extends Contract<SignatureValidatorDefinition> {
    constructor(eth: Eth, address?: Address, options?: ContractOptions);
}
export declare let SignatureValidatorAbi: import("web3x/contract").ContractAbi;
export {};
