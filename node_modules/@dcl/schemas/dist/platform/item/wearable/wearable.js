"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wearable = void 0;
const validation_1 = require("../../../validation");
const wearable_category_1 = require("../../../dapps/wearable-category");
const representation_1 = require("./representation");
const base_item_1 = require("../base-item");
const standard_props_1 = require("../standard-props");
const third_party_props_1 = require("../third-party-props");
/** @alpha */
var Wearable;
(function (Wearable) {
    Wearable.schema = {
        type: 'object',
        properties: Object.assign(Object.assign(Object.assign(Object.assign({}, base_item_1.baseItemProperties), standard_props_1.standardProperties), third_party_props_1.thirdPartyProps), { data: {
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
            } }),
        additionalProperties: true,
        required: [...base_item_1.requiredBaseItemProps, 'data'],
        oneOf: [
            {
                required: ['collectionAddress', 'rarity'],
                prohibited: ['merkleProof', 'content']
            },
            {
                required: [
                    'merkleProof',
                    /* MerkleProof emote required Keys (might be redundant) */
                    'content',
                    'id',
                    'name',
                    'description',
                    'i18n',
                    'image',
                    'thumbnail',
                    'data'
                ],
                prohibited: ['collectionAddress', 'rarity'],
                _isThirdParty: true
            }
        ],
        errorMessage: {
            oneOf: 'either standard XOR thirdparty properties conditions must be met'
        }
    };
    const _isThirdPartyKeywordDef = {
        keyword: '_isThirdParty',
        validate: (schema, data) => !schema || (0, third_party_props_1.isThirdParty)(data),
        errors: false
    };
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
    Wearable.validate = (0, validation_1.generateLazyValidator)(Wearable.schema, [
        _isThirdPartyKeywordDef
    ]);
})(Wearable = exports.Wearable || (exports.Wearable = {}));
//# sourceMappingURL=wearable.js.map