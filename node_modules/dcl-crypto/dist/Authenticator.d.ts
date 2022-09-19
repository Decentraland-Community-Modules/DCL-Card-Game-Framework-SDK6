import { EthereumProvider } from 'web3x/providers';
import { AuthIdentity, AuthChain, EthAddress, AuthLinkType, IdentityType, AuthLink, Signature, ValidationResult } from './types';
export declare const VALID_SIGNATURE: string;
export declare class Authenticator {
    /** Validate that the signature belongs to the Ethereum address */
    static validateSignature(expectedFinalAuthority: string, authChain: AuthChain, provider: EthereumProvider, dateToValidateExpirationInMillis?: number): Promise<ValidationResult>;
    static isValidAuthChain(authChain: AuthChain): boolean;
    static createEthereumMessageHash(msg: string): string;
    static createEIP1271MessageHash(msg: string): string;
    static createSimpleAuthChain(finalPayload: string, ownerAddress: EthAddress, signature: Signature): AuthChain;
    static createAuthChain(ownerIdentity: IdentityType, ephemeralIdentity: IdentityType, ephemeralMinutesDuration: number, entityId: string): AuthChain;
    static initializeAuthChain(ethAddress: EthAddress, ephemeralIdentity: IdentityType, ephemeralMinutesDuration: number, signer: (message: string) => Promise<string>): Promise<AuthIdentity>;
    static signPayload(authIdentity: AuthIdentity, entityId: string): AuthLink[];
    static createSignature(identity: IdentityType, message: string): string;
    static ownerAddress(authChain: AuthChain): EthAddress;
    static getEphemeralMessage(ephemeralAddress: string, expiration: Date): string;
}
declare type ValidatorType = (authority: string, authLink: AuthLink, options?: ValidationOptions) => Promise<{
    error?: string;
    nextAuthority?: string;
}>;
declare type ValidationOptions = {
    dateToValidateExpirationInMillis: number;
    provider?: EthereumProvider;
};
export declare const SIGNER_VALIDATOR: ValidatorType;
export declare const ECDSA_SIGNED_ENTITY_VALIDATOR: ValidatorType;
export declare const ECDSA_PERSONAL_EPHEMERAL_VALIDATOR: ValidatorType;
export declare const ECDSA_EIP_1654_EPHEMERAL_VALIDATOR: ValidatorType;
export declare const EIP_1654_SIGNED_ENTITY_VALIDATOR: ValidatorType;
export declare function getEphemeralSignatureType(signature: string): AuthLinkType;
export declare function getSignedIdentitySignatureType(signature: string): AuthLinkType;
export declare function parseEmphemeralPayload(payload: string): {
    message: string;
    ephemeralAddress: string;
    expiration: number;
};
export {};
