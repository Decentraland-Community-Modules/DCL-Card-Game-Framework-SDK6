import { JSONSchema } from '../../validation';
import { MerkleProof } from '../merkle-tree/merkle-proof';
import { BaseItem } from './base-item';
export declare type ThirdPartyProps = {
    merkleProof: MerkleProof;
    content: Record<string, string>;
};
export declare const thirdPartyProps: {
    readonly merkleProof: JSONSchema<MerkleProof>;
    readonly content: {
        readonly type: "object";
        readonly nullable: false;
        readonly additionalProperties: {
            readonly type: "string";
        };
        readonly required: any[];
    };
};
export declare function isThirdParty<T extends BaseItem>(item: T): item is T & ThirdPartyProps;
//# sourceMappingURL=third-party-props.d.ts.map