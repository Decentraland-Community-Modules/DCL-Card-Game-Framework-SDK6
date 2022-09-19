export declare type Signature = string;
export declare type EthAddress = string;
export declare type IdentityType = {
    privateKey: string;
    publicKey: string;
    address: string;
};
export declare type AuthChain = AuthLink[];
export declare type AuthLink = {
    type: AuthLinkType;
    payload: string;
    signature: Signature;
};
export declare enum AuthLinkType {
    SIGNER = "SIGNER",
    ECDSA_PERSONAL_EPHEMERAL = "ECDSA_EPHEMERAL",
    ECDSA_PERSONAL_SIGNED_ENTITY = "ECDSA_SIGNED_ENTITY",
    ECDSA_EIP_1654_EPHEMERAL = "ECDSA_EIP_1654_EPHEMERAL",
    ECDSA_EIP_1654_SIGNED_ENTITY = "ECDSA_EIP_1654_SIGNED_ENTITY"
}
export declare type AuthIdentity = {
    ephemeralIdentity: IdentityType;
    expiration: Date;
    authChain: AuthChain;
};
export declare type ValidationResult = {
    ok: boolean;
    message?: string;
};
