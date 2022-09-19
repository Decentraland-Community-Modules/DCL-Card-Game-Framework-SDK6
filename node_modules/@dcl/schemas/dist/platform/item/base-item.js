"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiredBaseItemProps = exports.baseItemProperties = void 0;
const i18n_1 = require("./i18n");
const metrics_1 = require("./metrics");
const displayable_1 = require("../shared/displayable");
// @internal
exports.baseItemProperties = Object.assign(Object.assign({}, displayable_1.displayableProperties), { id: {
        type: 'string'
    }, name: {
        type: 'string'
    }, description: {
        type: 'string'
    }, i18n: {
        type: 'array',
        items: i18n_1.I18N.schema,
        minItems: 1,
        uniqueItemProperties: ['code'],
        errorMessage: '${0#} array should not have duplicates for "code"'
    }, thumbnail: {
        type: 'string'
    }, image: {
        type: 'string'
    }, metrics: Object.assign(Object.assign({}, metrics_1.Metrics.schema), { nullable: true }) });
exports.requiredBaseItemProps = [
    'id',
    'name',
    'description',
    'i18n',
    'thumbnail',
    'image'
];
//# sourceMappingURL=base-item.js.map