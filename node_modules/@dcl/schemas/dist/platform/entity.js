"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = exports.EntityType = void 0;
const misc_1 = require("../misc");
const content_mapping_1 = require("../misc/content-mapping");
const validation_1 = require("../validation");
/**
 * Non-exhaustive list of EntityTypes.
 * @public
 */
var EntityType;
(function (EntityType) {
    EntityType["SCENE"] = "scene";
    EntityType["PROFILE"] = "profile";
    EntityType["WEARABLE"] = "wearable";
    EntityType["STORE"] = "store";
    EntityType["EMOTE"] = "emote";
})(EntityType = exports.EntityType || (exports.EntityType = {}));
/** @public */
var Entity;
(function (Entity) {
    Entity.schema = {
        type: 'object',
        properties: {
            version: { type: 'string', enum: ['v3'] },
            id: { type: 'string', oneOf: [misc_1.IPFSv1.schema, misc_1.IPFSv2.schema] },
            type: { type: 'string' },
            pointers: { type: 'array', items: { type: 'string', minLength: 1 } },
            timestamp: { type: 'number', minimum: 0 },
            content: { type: 'array', items: content_mapping_1.ContentMapping.schema },
            metadata: { type: 'object', nullable: true }
        },
        required: ['version', 'id', 'type', 'pointers', 'timestamp', 'content']
    };
    Entity.validate = (0, validation_1.generateLazyValidator)(Entity.schema);
})(Entity = exports.Entity || (exports.Entity = {}));
//# sourceMappingURL=entity.js.map