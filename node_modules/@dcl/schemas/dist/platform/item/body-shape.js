"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyShape = void 0;
const validation_1 = require("../../validation");
/** @alpha */
var BodyShape;
(function (BodyShape) {
    BodyShape["MALE"] = "urn:decentraland:off-chain:base-avatars:BaseMale";
    BodyShape["FEMALE"] = "urn:decentraland:off-chain:base-avatars:BaseFemale";
})(BodyShape = exports.BodyShape || (exports.BodyShape = {}));
/** @alpha */
(function (BodyShape) {
    BodyShape.schema = {
        type: 'string',
        enum: Object.values(BodyShape)
    };
    BodyShape.validate = (0, validation_1.generateLazyValidator)(BodyShape.schema);
})(BodyShape = exports.BodyShape || (exports.BodyShape = {}));
//# sourceMappingURL=body-shape.js.map