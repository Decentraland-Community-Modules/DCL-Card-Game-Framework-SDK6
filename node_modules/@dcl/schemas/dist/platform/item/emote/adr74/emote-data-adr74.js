"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmoteDataADR74 = void 0;
const emote_category_1 = require("../emote-category");
const validation_1 = require("../../../../validation");
const representation_adr74_1 = require("./representation-adr74");
var EmoteDataADR74;
(function (EmoteDataADR74) {
    EmoteDataADR74.schema = {
        type: 'object',
        properties: {
            tags: {
                type: 'array',
                items: {
                    type: 'string',
                    minLength: 1
                }
            },
            representations: {
                type: 'array',
                items: representation_adr74_1.EmoteRepresentationADR74.schema,
                minItems: 1
            },
            category: emote_category_1.EmoteCategory.schema,
            loop: {
                type: 'boolean'
            }
        },
        required: ['category', 'tags', 'representations', 'loop'],
        additionalProperties: true
    };
    EmoteDataADR74.validate = (0, validation_1.generateLazyValidator)(EmoteDataADR74.schema);
})(EmoteDataADR74 = exports.EmoteDataADR74 || (exports.EmoteDataADR74 = {}));
//# sourceMappingURL=emote-data-adr74.js.map