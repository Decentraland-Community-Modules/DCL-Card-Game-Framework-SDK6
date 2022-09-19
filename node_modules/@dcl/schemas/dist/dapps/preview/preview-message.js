"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.PreviewMessageType = void 0;
const validation_1 = require("../../validation");
var PreviewMessageType;
(function (PreviewMessageType) {
    PreviewMessageType["READY"] = "ready";
    PreviewMessageType["LOAD"] = "load";
    PreviewMessageType["ERROR"] = "error";
    PreviewMessageType["UPDATE"] = "update";
    PreviewMessageType["CONTROLLER_REQUEST"] = "controller_request";
    PreviewMessageType["CONTROLLER_RESPONSE"] = "controller_response";
    PreviewMessageType["EMOTE_EVENT"] = "emote_event";
})(PreviewMessageType = exports.PreviewMessageType || (exports.PreviewMessageType = {}));
/** @alpha */
(function (PreviewMessageType) {
    PreviewMessageType.schema = {
        type: 'string',
        enum: Object.values(PreviewMessageType)
    };
    PreviewMessageType.validate = (0, validation_1.generateLazyValidator)(PreviewMessageType.schema);
})(PreviewMessageType = exports.PreviewMessageType || (exports.PreviewMessageType = {}));
const sendMessage = (window, type, payload, targetOrigin = '*') => {
    const event = { type, payload };
    window.postMessage(event, targetOrigin);
};
exports.sendMessage = sendMessage;
//# sourceMappingURL=preview-message.js.map