import { WearableCategory } from '../../../dapps/wearable-category';
import { JSONSchema, ValidateFunction } from '../../../validation';
import { BodyShape } from '../body-shape';
/** @alpha */
export declare type WearableRepresentation = {
    bodyShapes: BodyShape[];
    mainFile: string;
    contents: string[];
    overrideHides: WearableCategory[];
    overrideReplaces: WearableCategory[];
};
/** @alpha */
export declare namespace WearableRepresentation {
    const schema: JSONSchema<WearableRepresentation>;
    const validate: ValidateFunction<WearableRepresentation>;
}
//# sourceMappingURL=representation.d.ts.map