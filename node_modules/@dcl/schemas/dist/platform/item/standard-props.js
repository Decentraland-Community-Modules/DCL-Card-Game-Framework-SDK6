"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStandard = exports.standardProperties = void 0;
const rarity_1 = require("../../dapps/rarity");
const validation_1 = require("../../validation");
exports.standardProperties = {
    collectionAddress: {
        type: 'string',
        nullable: false
    },
    rarity: rarity_1.Rarity.schema
};
const schema = {
    type: 'object',
    properties: Object.assign({}, exports.standardProperties),
    required: ['collectionAddress', 'rarity']
};
const validate = (0, validation_1.generateLazyValidator)(schema);
function isStandard(item) {
    return validate(item);
}
exports.isStandard = isStandard;
//# sourceMappingURL=standard-props.js.map