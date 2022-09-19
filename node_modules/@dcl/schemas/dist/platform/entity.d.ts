import { IPFSv1, IPFSv2 } from '../misc';
import { ContentMapping } from '../misc/content-mapping';
import { JSONSchema, ValidateFunction } from '../validation';
/**
 * Non-exhaustive list of EntityTypes.
 * @public
 */
export declare enum EntityType {
    SCENE = "scene",
    PROFILE = "profile",
    WEARABLE = "wearable",
    STORE = "store",
    EMOTE = "emote"
}
/**
 * Internal representation of an entity in the catalyst.
 *
 * This Entity's content mappings adhere to ADR45.
 *
 * @public
 */
export declare type Entity = {
    /** @deprecated ADR45 removed entity versions. */
    version: string;
    id: IPFSv1 | IPFSv2;
    type: EntityType;
    pointers: string[];
    timestamp: number;
    content: ContentMapping[];
    metadata?: any;
};
/** @public */
export declare namespace Entity {
    const schema: JSONSchema<Entity>;
    const validate: ValidateFunction<Entity>;
}
//# sourceMappingURL=entity.d.ts.map