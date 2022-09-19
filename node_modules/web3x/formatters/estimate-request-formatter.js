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
const address_1 = require("../address");
const utils_1 = require("../utils");
function toRawEstimateRequest(tx) {
    const { from, to, gas, gasPrice, value, data } = tx;
    return {
        from: from ? from.toString().toLowerCase() : undefined,
        to: to ? to.toString().toLowerCase() : undefined,
        data: data ? utils_1.bufferToHex(data) : undefined,
        value: value ? utils_1.numberToHex(value) : undefined,
        gas: gas ? utils_1.numberToHex(gas) : undefined,
        gasPrice: gasPrice ? utils_1.numberToHex(gasPrice) : undefined,
    };
}
exports.toRawEstimateRequest = toRawEstimateRequest;
function fromRawEstimateRequest(tx) {
    const { from, to, gas, gasPrice, value, data } = tx;
    return {
        from: from ? address_1.Address.fromString(from) : undefined,
        to: to ? address_1.Address.fromString(to) : undefined,
        data: data ? utils_1.hexToBuffer(data) : undefined,
        value: value ? utils_1.hexToNumberString(value) : undefined,
        gas: gas ? utils_1.hexToNumberString(gas) : undefined,
        gasPrice: gasPrice ? utils_1.hexToNumberString(gasPrice) : undefined,
    };
}
exports.fromRawEstimateRequest = fromRawEstimateRequest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXN0aW1hdGUtcmVxdWVzdC1mb3JtYXR0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZm9ybWF0dGVycy9lc3RpbWF0ZS1yZXF1ZXN0LWZvcm1hdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7OztFQWVFOztBQUVGLHdDQUFxQztBQUNyQyxvQ0FBb0Y7QUFvQnBGLFNBQWdCLG9CQUFvQixDQUFDLEVBQW1CO0lBQ3RELE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUNwRCxPQUFPO1FBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQ3RELEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUztRQUNoRCxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxtQkFBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQzFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLG1CQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFDN0MsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsbUJBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztRQUN2QyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxtQkFBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO0tBQ3ZELENBQUM7QUFDSixDQUFDO0FBVkQsb0RBVUM7QUFFRCxTQUFnQixzQkFBc0IsQ0FBQyxFQUFzQjtJQUMzRCxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDcEQsT0FBTztRQUNMLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLGlCQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQ2pELEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLGlCQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQzNDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLG1CQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFDMUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMseUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFDbkQsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMseUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFDN0MsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMseUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7S0FDN0QsQ0FBQztBQUNKLENBQUM7QUFWRCx3REFVQyJ9