"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmoteCategory = void 0;
const validation_1 = require("../../../validation");
var EmoteCategory;
(function (EmoteCategory) {
    EmoteCategory["DANCE"] = "dance";
    EmoteCategory["STUNT"] = "stunt";
    EmoteCategory["GREETINGS"] = "greetings";
    EmoteCategory["FUN"] = "fun";
    EmoteCategory["POSES"] = "poses";
    EmoteCategory["REACTIONS"] = "reactions";
    EmoteCategory["HORROR"] = "horror";
    EmoteCategory["MISCELLANEOUS"] = "miscellaneous";
})(EmoteCategory = exports.EmoteCategory || (exports.EmoteCategory = {}));
(function (EmoteCategory) {
    EmoteCategory.schema = {
        type: 'string',
        enum: Object.values(EmoteCategory)
    };
    EmoteCategory.validate = (0, validation_1.generateLazyValidator)(EmoteCategory.schema);
})(EmoteCategory = exports.EmoteCategory || (exports.EmoteCategory = {}));
//# sourceMappingURL=emote-category.js.map