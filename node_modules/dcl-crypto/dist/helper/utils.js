"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Takes the current date, add or subtract minutes, and returns it */
function moveMinutes(minutes) {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    return date;
}
exports.moveMinutes = moveMinutes;
//# sourceMappingURL=utils.js.map