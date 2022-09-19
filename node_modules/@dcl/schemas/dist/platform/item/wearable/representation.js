"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WearableRepresentation = void 0;
const wearable_category_1 = require("../../../dapps/wearable-category");
const validation_1 = require("../../../validation");
const body_shape_1 = require("../body-shape");
/** @alpha */
var WearableRepresentation;
(function (WearableRepresentation) {
    WearableRepresentation.schema = {
        type: 'object',
        properties: {
            bodyShapes: {
                type: 'array',
                items: body_shape_1.BodyShape.schema,
                minItems: 1,
                uniqueItems: true
            },
            mainFile: {
                type: 'string',
                minLength: 1
            },
            contents: {
                type: 'array',
                items: {
                    type: 'string'
                },
                minItems: 1,
                uniqueItems: true,
                contains: {
                    const: { $data: '2/mainFile' }
                }
            },
            overrideHides: {
                type: 'array',
                items: wearable_category_1.WearableCategory.schema
            },
            overrideReplaces: {
                type: 'array',
                items: wearable_category_1.WearableCategory.schema
            }
        },
        required: [
            'bodyShapes',
            'mainFile',
            'contents',
            'overrideHides',
            'overrideReplaces'
        ]
    };
    WearableRepresentation.validate = (0, validation_1.generateLazyValidator)(WearableRepresentation.schema);
})(WearableRepresentation = exports.WearableRepresentation || (exports.WearableRepresentation = {}));
//# sourceMappingURL=representation.js.map