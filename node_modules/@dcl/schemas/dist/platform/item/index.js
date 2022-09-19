"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isThirdParty = exports.isStandard = exports.BodyShape = exports.Metrics = exports.Locale = exports.I18N = void 0;
var i18n_1 = require("./i18n");
Object.defineProperty(exports, "I18N", { enumerable: true, get: function () { return i18n_1.I18N; } });
var locale_1 = require("./locale");
Object.defineProperty(exports, "Locale", { enumerable: true, get: function () { return locale_1.Locale; } });
var metrics_1 = require("./metrics");
Object.defineProperty(exports, "Metrics", { enumerable: true, get: function () { return metrics_1.Metrics; } });
var body_shape_1 = require("./body-shape");
Object.defineProperty(exports, "BodyShape", { enumerable: true, get: function () { return body_shape_1.BodyShape; } });
var standard_props_1 = require("./standard-props");
Object.defineProperty(exports, "isStandard", { enumerable: true, get: function () { return standard_props_1.isStandard; } });
var third_party_props_1 = require("./third-party-props");
Object.defineProperty(exports, "isThirdParty", { enumerable: true, get: function () { return third_party_props_1.isThirdParty; } });
__exportStar(require("./wearable"), exports);
__exportStar(require("./emote"), exports);
//# sourceMappingURL=index.js.map