"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreviewProjection = void 0;
const validation_1 = require("../../validation");
var PreviewProjection;
(function (PreviewProjection) {
    PreviewProjection["ORTHOGRAPHIC"] = "orthographic";
    PreviewProjection["PERSPECTIVE"] = "perspective";
})(PreviewProjection = exports.PreviewProjection || (exports.PreviewProjection = {}));
(function (PreviewProjection) {
    PreviewProjection.schema = {
        type: 'string',
        enum: Object.values(PreviewProjection)
    };
    PreviewProjection.validate = (0, validation_1.generateLazyValidator)(PreviewProjection.schema);
})(PreviewProjection = exports.PreviewProjection || (exports.PreviewProjection = {}));
//# sourceMappingURL=preview-projection.js.map