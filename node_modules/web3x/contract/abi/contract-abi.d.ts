/// <reference types="node" />
import { ContractAbiDefinition, ContractEventEntry, ContractFunctionEntry } from '.';
import { LogResponse } from '../../formatters';
export declare class ContractAbi {
    functions: ContractFunctionEntry[];
    events: ContractEventEntry[];
    ctor: ContractFunctionEntry;
    fallback?: ContractFunctionEntry;
    constructor(definition: ContractAbiDefinition);
    findEntryForLog(log: LogResponse): ContractEventEntry | undefined;
    decodeEvent(log: LogResponse): import("../../formatters").EventLog<any, string>;
    decodeFunctionData(data: Buffer): any;
}
