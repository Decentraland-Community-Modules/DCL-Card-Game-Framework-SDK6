import { JSONSchema, ValidateFunction } from '../validation';
/**
 * @public
 */
export declare type AuthLink = {
    type: AuthLinkType;
    payload: string;
    signature?: string;
};
/**
 * @public
 */
export declare enum AuthLinkType {
    'SIGNER' = "SIGNER",
    'ECDSA_PERSONAL_EPHEMERAL' = "ECDSA_EPHEMERAL",
    'ECDSA_PERSONAL_SIGNED_ENTITY' = "ECDSA_SIGNED_ENTITY",
    /**
     * See https://github.com/ethereum/EIPs/issues/1654
     */
    'ECDSA_EIP_1654_EPHEMERAL' = "ECDSA_EIP_1654_EPHEMERAL",
    /**
     * See https://github.com/ethereum/EIPs/issues/1654
     */
    'ECDSA_EIP_1654_SIGNED_ENTITY' = "ECDSA_EIP_1654_SIGNED_ENTITY"
}
/**
 * @public
 */
export declare namespace AuthLink {
    const schema: JSONSchema<AuthLink>;
    const validate: ValidateFunction<AuthLink>;
}
/**
 * AuthChain is an array of elements used to create and verify signatures
 * and ephemeral keys.
 *
 * @public
 */
export declare type AuthChain = AuthLink[];
/** @public */
export declare namespace AuthChain {
    const schema: JSONSchema<AuthChain>;
    const validate: ValidateFunction<AuthChain>;
}
//# sourceMappingURL=auth-chain.d.ts.map