export declare type AbiDataTypes = 'uint256' | 'boolean' | 'string' | 'bytes' | string;
export declare type AbiInput = {
    components?: any;
    name: string;
    type: AbiDataTypes;
    indexed?: boolean;
    internalType?: string;
};
export declare type AbiOutput = {
    components?: any;
    name: string;
    type: AbiDataTypes;
    internalType?: string;
};
export interface ContractEntryDefinition {
    constant?: boolean;
    payable?: boolean;
    anonymous?: boolean;
    inputs?: AbiInput[];
    name?: string;
    outputs?: AbiOutput[];
    type: 'function' | 'constructor' | 'event' | 'fallback';
    stateMutability?: 'pure' | 'view' | 'payable' | 'nonpayable';
    signature?: string;
    gas?: number;
}
export declare type ContractAbiDefinition = ContractEntryDefinition[];
