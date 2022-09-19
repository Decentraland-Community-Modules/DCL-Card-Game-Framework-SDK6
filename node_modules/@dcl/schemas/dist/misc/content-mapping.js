"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentMapping = void 0;
const misc_1 = require("../misc");
const validation_1 = require("../validation");
/** @public */
var ContentMapping;
(function (ContentMapping) {
    ContentMapping.schema = {
        type: 'object',
        properties: {
            file: { type: 'string', minLength: 1 },
            hash: { type: 'string', oneOf: [misc_1.IPFSv1.schema, misc_1.IPFSv2.schema] }
        },
        required: ['file', 'hash']
    };
    ContentMapping.validate = (0, validation_1.generateLazyValidator)(ContentMapping.schema);
})(ContentMapping = exports.ContentMapping || (exports.ContentMapping = {}));
//# sourceMappingURL=content-mapping.js.map