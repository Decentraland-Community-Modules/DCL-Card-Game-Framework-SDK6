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
function toRawCallRequest(tx) {
    const { from, to, gas, gasPrice, value, data } = tx;
    return {
        from: from ? from.toString().toLowerCase() : undefined,
        to: to.toString().toLowerCase(),
        data: data ? utils_1.bufferToHex(data) : undefined,
        value: value ? utils_1.numberToHex(value) : undefined,
        gas: gas ? utils_1.numberToHex(gas) : undefined,
        gasPrice: gasPrice ? utils_1.numberToHex(gasPrice) : undefined,
    };
}
exports.toRawCallRequest = toRawCallRequest;
function fromRawCallRequest(tx) {
    const { from, to, gas, gasPrice, value, data } = tx;
    return {
        from: from ? address_1.Address.fromString(from) : undefined,
        to: address_1.Address.fromString(to),
        data: data ? utils_1.hexToBuffer(data) : undefined,
        value: value ? utils_1.hexToNumberString(value) : undefined,
        gas: gas ? utils_1.hexToNumberString(gas) : undefined,
        gasPrice: gasPrice ? utils_1.hexToNumberString(gasPrice) : undefined,
    };
}
exports.fromRawCallRequest = fromRawCallRequest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsbC1yZXF1ZXN0LWZvcm1hdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mb3JtYXR0ZXJzL2NhbGwtcmVxdWVzdC1mb3JtYXR0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7RUFlRTs7QUFFRix3Q0FBcUM7QUFDckMsb0NBQW9GO0FBb0JwRixTQUFnQixnQkFBZ0IsQ0FBQyxFQUFlO0lBQzlDLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUNwRCxPQUFPO1FBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQ3RELEVBQUUsRUFBRSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsV0FBVyxFQUFFO1FBQy9CLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLG1CQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFDMUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsbUJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztRQUM3QyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxtQkFBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQ3ZDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLG1CQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7S0FDdkQsQ0FBQztBQUNKLENBQUM7QUFWRCw0Q0FVQztBQUVELFNBQWdCLGtCQUFrQixDQUFDLEVBQWtCO0lBQ25ELE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUNwRCxPQUFPO1FBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFDakQsRUFBRSxFQUFFLGlCQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztRQUMxQixJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxtQkFBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQzFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLHlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQ25ELEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLHlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQzdDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLHlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO0tBQzdELENBQUM7QUFDSixDQUFDO0FBVkQsZ0RBVUMifQ==