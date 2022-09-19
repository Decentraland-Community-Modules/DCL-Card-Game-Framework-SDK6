"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emote = void 0;
const __1 = require("..");
const validation_1 = require("../../../validation");
const base_item_1 = require("../base-item");
const standard_props_1 = require("../standard-props");
const third_party_props_1 = require("../third-party-props");
const emote_data_adr74_1 = require("./adr74/emote-data-adr74");
/** @alpha */
var Emote;
(function (Emote) {
    Emote.schema = {
        type: 'object',
        properties: Object.assign(Object.assign(Object.assign(Object.assign({}, base_item_1.baseItemProperties), standard_props_1.standardProperties), third_party_props_1.thirdPartyProps), { emoteDataADR74: emote_data_adr74_1.EmoteDataADR74.schema }),
        additionalProperties: true,
        required: [...base_item_1.requiredBaseItemProps],
        oneOf: [
            {
                required: ['emoteDataADR74'],
                // Emotes of ADR74 must be standard XOR thirdparty
                oneOf: [
                    {
                        required: ['collectionAddress', 'rarity'],
                        prohibited: ['merkleProof', 'content'],
                        errorMessage: 'standard properties conditions are not met'
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
                            'emoteDataADR74'
                        ],
                        _isThirdParty: true,
                        prohibited: ['collectionAddress', 'rarity'],
                        errorMessage: 'thirdparty properties conditions are not met'
                    }
                ],
                errorMessage: {
                    oneOf: 'emote should have either standard or thirdparty properties'
                }
            }
        ],
        errorMessage: {
            oneOf: 'emote should have "emoteDataADR74" and match its schema'
        }
    };
    const _isThirdPartyKeywordDef = {
        keyword: '_isThirdParty',
        validate: (schema, data) => !schema || (0, __1.isThirdParty)(data),
        errors: false
    };
    Emote.validate = (0, validation_1.generateLazyValidator)(Emote.schema, [
        _isThirdPartyKeywordDef
    ]);
})(Emote = exports.Emote || (exports.Emote = {}));
//# sourceMappingURL=emote.js.map