import { JSONSchema, ValidateFunction } from '../../validation';
/** @alpha */
export declare enum BodyShape {
    MALE = "urn:decentraland:off-chain:base-avatars:BaseMale",
    FEMALE = "urn:decentraland:off-chain:base-avatars:BaseFemale"
}
/** @alpha */
export declare namespace BodyShape {
    const schema: JSONSchema<BodyShape>;
    const validate: ValidateFunction<BodyShape>;
}
//# sourceMappingURL=body-shape.d.ts.map