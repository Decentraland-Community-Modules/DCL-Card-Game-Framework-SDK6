import { JSONSchema } from '../../../validation';
import { WearableCategory } from '../../../dapps/wearable-category';
import { WearableRepresentation } from './representation';
import { BaseItem } from '../base-item';
import { StandardProps } from '../standard-props';
import { ThirdPartyProps } from '../third-party-props';
/** @alpha */
export declare type Wearable = BaseItem & {
    data: {
        replaces: WearableCategory[];
        hides: WearableCategory[];
        tags: string[];
        representations: WearableRepresentation[];
        category: WearableCategory;
    };
} & (StandardProps | ThirdPartyProps);
/** @alpha */
export declare namespace Wearable {
    const schema: JSONSchema<Wearable>;
    /**
     * Validates that the wearable metadata complies with the standard or third party wearable, and doesn't have repeated locales.
     * Some fields are defined as optional but those are validated to be present as standard XOR third party:
     *  Standard Wearables should contain:
     *    - collectionAddress
     *    - rarity
     *  Third Party Wearables should contain:
     *    - merkleProof
     *    - content
     */
    const validate: import("../../../validation").ValidateFunction<Wearable>;
}
//# sourceMappingURL=wearable.d.ts.map