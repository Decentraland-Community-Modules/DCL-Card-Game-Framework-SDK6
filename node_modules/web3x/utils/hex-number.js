"use strict";
/*
  This file is part of web3x.

  web3x is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  web3x is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public License
  along with web3x.  If not, see <http://www.gnu.org/licenses/>.
*/
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bn_js_1 = tslib_1.__importDefault(require("bn.js"));
const bn_1 = require("./bn");
/**
 * Converts value to it's number representation
 *
 * @method hexToNumber
 * @param {String|Number|BN} value
 * @return {String}
 */
function hexToNumber(value) {
    return bn_1.toBN(value).toNumber();
}
exports.hexToNumber = hexToNumber;
/**
 * Converts value to it's decimal representation in string
 *
 * @method hexToNumberString
 * @param {String|Number|BN} value
 * @return {String}
 */
function hexToNumberString(value) {
    return bn_1.toBN(value).toString(10);
}
exports.hexToNumberString = hexToNumberString;
/**
 * Converts value to it's hex representation
 *
 * @method numberToHex
 * @param {String|Number|BN} value
 * @return {String}
 */
function numberToHex(value) {
    const num = bn_1.toBN(value);
    const result = num.toString(16);
    return num.lt(new bn_js_1.default(0)) ? '-0x' + result.substr(1) : '0x' + result;
}
exports.numberToHex = numberToHex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGV4LW51bWJlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9oZXgtbnVtYmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7O0VBZUU7OztBQUVGLDBEQUF1QjtBQUN2Qiw2QkFBNEI7QUFFNUI7Ozs7OztHQU1HO0FBQ0gsU0FBZ0IsV0FBVyxDQUFDLEtBQXNCO0lBQ2hELE9BQU8sU0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ2hDLENBQUM7QUFGRCxrQ0FFQztBQUVEOzs7Ozs7R0FNRztBQUNILFNBQWdCLGlCQUFpQixDQUFDLEtBQWE7SUFDN0MsT0FBTyxTQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2xDLENBQUM7QUFGRCw4Q0FFQztBQUVEOzs7Ozs7R0FNRztBQUNILFNBQWdCLFdBQVcsQ0FBQyxLQUEyQjtJQUNyRCxNQUFNLEdBQUcsR0FBRyxTQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEIsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUVoQyxPQUFPLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxlQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7QUFDdEUsQ0FBQztBQUxELGtDQUtDIn0=