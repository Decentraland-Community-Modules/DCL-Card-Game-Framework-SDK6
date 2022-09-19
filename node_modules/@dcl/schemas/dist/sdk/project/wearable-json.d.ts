import { Rarity } from '../../dapps/rarity';
import { Wearable } from '../../platform/item/wearable/wearable';
import { JSONSchema, ValidateFunction } from '../../validation';
/**
 * @alpha
 */
export declare type WearableJson = Pick<Wearable, 'data' | 'name' | 'description'> & {
    rarity: Rarity;
};
/**
 * @alpha
 */
export declare namespace WearableJson {
    const schema: JSONSchema<WearableJson>;
    const validate: ValidateFunction<WearableJson>;
}
//# sourceMappingURL=wearable-json.d.ts.map