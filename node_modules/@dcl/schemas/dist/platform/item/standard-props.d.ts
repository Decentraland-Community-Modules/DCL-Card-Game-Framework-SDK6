import { Rarity } from '../../dapps/rarity';
import { BaseItem } from './base-item';
import { JSONSchema } from '../../validation';
export declare type StandardProps = {
    collectionAddress: string;
    rarity: Rarity;
};
export declare const standardProperties: {
    readonly collectionAddress: {
        readonly type: "string";
        readonly nullable: false;
    };
    readonly rarity: JSONSchema<Rarity>;
};
export declare function isStandard<T extends BaseItem>(item: T): item is T & StandardProps;
//# sourceMappingURL=standard-props.d.ts.map