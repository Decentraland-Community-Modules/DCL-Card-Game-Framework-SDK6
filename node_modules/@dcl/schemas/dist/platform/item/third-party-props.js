"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isThirdParty = exports.thirdPartyProps = void 0;
const validation_1 = require("../../validation");
const merkle_proof_1 = require("../merkle-tree/merkle-proof");
exports.thirdPartyProps = {
    merkleProof: merkle_proof_1.MerkleProof.schema,
    content: {
        type: 'object',
        nullable: false,
        additionalProperties: { type: 'string' },
        required: []
    }
};
const schema = {
    type: 'object',
    properties: Object.assign({}, exports.thirdPartyProps),
    required: ['merkleProof', 'content'],
    _containsHashingKeys: true
};
const _containsHashingKeys = {
    keyword: '_containsHashingKeys',
    validate: (schema, data) => {
        var _a;
        const itemAsThirdParty = data;
        if ((_a = itemAsThirdParty === null || itemAsThirdParty === void 0 ? void 0 : itemAsThirdParty.merkleProof) === null || _a === void 0 ? void 0 : _a.hashingKeys) {
            return itemAsThirdParty.merkleProof.hashingKeys.every((key) => itemAsThirdParty.hasOwnProperty(key));
        }
        return false;
    },
    errors: false
};
const validate = (0, validation_1.generateLazyValidator)(schema, [_containsHashingKeys]);
function isThirdParty(item) {
    return validate(item);
}
exports.isThirdParty = isThirdParty;
//# sourceMappingURL=third-party-props.js.map