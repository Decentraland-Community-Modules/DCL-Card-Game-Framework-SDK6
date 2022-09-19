import { IPFSv1, IPFSv2 } from '../misc';
import { JSONSchema, ValidateFunction } from '../validation';
/**
 * Represents a content mapping. The Decentraland file system is
 * case-insensitive. `file` must be lower cased.
 *
 * Duplicated files will throw a validation error.
 *
 * .file is a relative path
 * .hash is a valid IPFS hash.
 *
 * @public
 */
export declare type ContentMapping = {
    file: string;
    hash: IPFSv1 | IPFSv2;
};
/** @public */
export declare namespace ContentMapping {
    const schema: JSONSchema<ContentMapping>;
    const validate: ValidateFunction<ContentMapping>;
}
//# sourceMappingURL=content-mapping.d.ts.map