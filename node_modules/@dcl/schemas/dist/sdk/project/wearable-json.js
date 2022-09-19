"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WearableJson = void 0;
const rarity_1 = require("../../dapps/rarity");
const wearable_category_1 = require("../../dapps/wearable-category");
const representation_1 = require("../../platform/item/wearable/representation");
const validation_1 = require("../../validation");
/**
 * @alpha
 */
var WearableJson;
(function (WearableJson) {
    WearableJson.schema = {
        type: 'object',
        properties: {
            description: {
                type: 'string'
            },
            rarity: Object.assign(Object.assign({}, rarity_1.Rarity.schema), { nullable: true }),
            name: {
                type: 'string'
            },
            data: {
                type: 'object',
                properties: {
                    replaces: {
                        type: 'array',
                        items: wearable_category_1.WearableCategory.schema
                    },
                    hides: {
                        type: 'array',
                        items: wearable_category_1.WearableCategory.schema
                    },
                    tags: {
                        type: 'array',
                        items: {
                            type: 'string',
                            minLength: 1
                        }
                    },
                    representations: {
                        type: 'array',
                        items: representation_1.WearableRepresentation.schema,
                        minItems: 1
                    },
                    category: wearable_category_1.WearableCategory.schema
                },
                required: ['replaces', 'hides', 'tags', 'representations', 'category']
            }
        },
        additionalProperties: true,
        required: ['description', 'name', 'data']
    };
    WearableJson.validate = (0, validation_1.generateLazyValidator)(WearableJson.schema);
})(WearableJson = exports.WearableJson || (exports.WearableJson = {}));
//# sourceMappingURL=wearable-json.js.map