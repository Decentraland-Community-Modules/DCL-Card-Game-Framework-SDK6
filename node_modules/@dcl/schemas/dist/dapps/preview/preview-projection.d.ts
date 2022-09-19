import { JSONSchema, ValidateFunction } from '../../validation';
export declare enum PreviewProjection {
    ORTHOGRAPHIC = "orthographic",
    PERSPECTIVE = "perspective"
}
export declare namespace PreviewProjection {
    const schema: JSONSchema<PreviewProjection>;
    const validate: ValidateFunction<PreviewProjection>;
}
//# sourceMappingURL=preview-projection.d.ts.map