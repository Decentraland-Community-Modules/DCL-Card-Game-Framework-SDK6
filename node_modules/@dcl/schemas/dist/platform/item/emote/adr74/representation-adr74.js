"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmoteRepresentationADR74 = void 0;
const validation_1 = require("../../../../validation");
const body_shape_1 = require("../../body-shape");
/** @alpha */
var EmoteRepresentationADR74;
(function (EmoteRepresentationADR74) {
    EmoteRepresentationADR74.schema = {
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
                },
                errorMessage: {
                    contains: 'contents should contain mainFile: ${1/mainFile}'
                }
            }
        },
        required: ['bodyShapes', 'mainFile', 'contents']
    };
    EmoteRepresentationADR74.validate = (0, validation_1.generateLazyValidator)(EmoteRepresentationADR74.schema);
})(EmoteRepresentationADR74 = exports.EmoteRepresentationADR74 || (exports.EmoteRepresentationADR74 = {}));
//# sourceMappingURL=representation-adr74.js.map