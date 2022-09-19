import BN from 'bn.js';
import { Address } from 'web3x/address';
import { Contract, ContractOptions, EventSubscriptionFactory, TxCall, TxSend } from 'web3x/contract';
import { Eth } from 'web3x/eth';
import { EventLog, TransactionReceipt } from 'web3x/formatters';
export declare type AddCatalystEvent = {
    _id: string;
    _owner: Address;
    _domain: string;
};
export declare type RemoveCatalystEvent = {
    _id: string;
    _owner: Address;
    _domain: string;
};
export declare type ScriptResultEvent = {
    executor: Address;
    script: string;
    input: string;
    returnData: string;
};
export declare type RecoverToVaultEvent = {
    vault: Address;
    token: Address;
    amount: string;
};
export declare type AddCatalystEventLog = EventLog<AddCatalystEvent, 'AddCatalyst'>;
export declare type RemoveCatalystEventLog = EventLog<RemoveCatalystEvent, 'RemoveCatalyst'>;
export declare type ScriptResultEventLog = EventLog<ScriptResultEvent, 'ScriptResult'>;
export declare type RecoverToVaultEventLog = EventLog<RecoverToVaultEvent, 'RecoverToVault'>;
interface CatalystEvents {
    AddCatalyst: EventSubscriptionFactory<AddCatalystEventLog>;
    RemoveCatalyst: EventSubscriptionFactory<RemoveCatalystEventLog>;
    ScriptResult: EventSubscriptionFactory<ScriptResultEventLog>;
    RecoverToVault: EventSubscriptionFactory<RecoverToVaultEventLog>;
}
interface CatalystEventLogs {
    AddCatalyst: AddCatalystEventLog;
    RemoveCatalyst: RemoveCatalystEventLog;
    ScriptResult: ScriptResultEventLog;
    RecoverToVault: RecoverToVaultEventLog;
}
interface CatalystTxEventLogs {
    AddCatalyst: AddCatalystEventLog[];
    RemoveCatalyst: RemoveCatalystEventLog[];
    ScriptResult: ScriptResultEventLog[];
    RecoverToVault: RecoverToVaultEventLog[];
}
export declare type CatalystTransactionReceipt = TransactionReceipt<CatalystTxEventLogs>;
interface CatalystMethods {
    owners(a0: Address): TxCall<boolean>;
    hasInitialized(): TxCall<boolean>;
    catalystCount(): TxCall<string>;
    getEVMScriptExecutor(_script: string): TxCall<Address>;
    getRecoveryVault(): TxCall<Address>;
    catalystIndexById(a0: string): TxCall<string>;
    catalystOwner(_id: string): TxCall<Address>;
    catalystDomain(_id: string): TxCall<string>;
    catalystIds(a0: number | string | BN): TxCall<string>;
    allowRecoverability(token: Address): TxCall<boolean>;
    appId(): TxCall<string>;
    initialize(): TxSend<CatalystTransactionReceipt>;
    getInitializationBlock(): TxCall<string>;
    transferToVault(_token: Address): TxSend<CatalystTransactionReceipt>;
    canPerform(_sender: Address, _role: string, _params: (number | string | BN)[]): TxCall<boolean>;
    getEVMScriptRegistry(): TxCall<Address>;
    removeCatalyst(_id: string): TxSend<CatalystTransactionReceipt>;
    domains(a0: string): TxCall<boolean>;
    catalystById(a0: string): TxCall<{
        id: string;
        0: string;
        owner: Address;
        1: Address;
        domain: string;
        2: string;
        startTime: string;
        3: string;
        endTime: string;
        4: string;
    }>;
    addCatalyst(_owner: Address, _domain: string): TxSend<CatalystTransactionReceipt>;
    kernel(): TxCall<Address>;
    MODIFY_ROLE(): TxCall<string>;
    isPetrified(): TxCall<boolean>;
}
export interface CatalystDefinition {
    methods: CatalystMethods;
    events: CatalystEvents;
    eventLogs: CatalystEventLogs;
}
export declare class Catalyst extends Contract<CatalystDefinition> {
    constructor(eth: Eth, address?: Address, options?: ContractOptions);
    deploy(): TxSend<CatalystTransactionReceipt>;
}
export {};
