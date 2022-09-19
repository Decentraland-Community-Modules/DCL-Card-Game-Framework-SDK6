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
function toRawTransactionRequest(tx) {
    const { from, to, gas, gasPrice, value, nonce, data } = tx;
    return {
        from: from.toString().toLowerCase(),
        to: to ? to.toString().toLowerCase() : undefined,
        gas: gas ? utils_1.numberToHex(gas) : undefined,
        gasPrice: gasPrice ? utils_1.numberToHex(gasPrice) : undefined,
        value: value ? utils_1.numberToHex(value) : undefined,
        data: data ? utils_1.bufferToHex(data) : undefined,
        nonce: nonce ? utils_1.numberToHex(nonce) : undefined,
    };
}
exports.toRawTransactionRequest = toRawTransactionRequest;
function fromRawTransactionRequest(tx) {
    const { from, to, gas, gasPrice, value, nonce, data } = tx;
    return {
        from: address_1.Address.fromString(from),
        to: to ? address_1.Address.fromString(to) : undefined,
        gas: gas ? utils_1.hexToNumberString(gas) : undefined,
        gasPrice: gasPrice ? utils_1.hexToNumberString(gasPrice) : undefined,
        value: value ? utils_1.hexToNumberString(value) : undefined,
        data: data ? utils_1.hexToBuffer(data) : undefined,
        nonce: nonce ? utils_1.hexToNumberString(nonce) : undefined,
    };
}
exports.fromRawTransactionRequest = fromRawTransactionRequest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24tcmVxdWVzdC1mb3JtYXR0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZm9ybWF0dGVycy90cmFuc2FjdGlvbi1yZXF1ZXN0LWZvcm1hdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7OztFQWVFOztBQUVGLHdDQUFxQztBQUNyQyxvQ0FBb0Y7QUFnQ3BGLFNBQWdCLHVCQUF1QixDQUFDLEVBQXNCO0lBQzVELE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDM0QsT0FBTztRQUNMLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsV0FBVyxFQUFFO1FBQ25DLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUztRQUNoRCxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxtQkFBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQ3ZDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLG1CQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFDdEQsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsbUJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztRQUM3QyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxtQkFBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQzFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLG1CQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7S0FDOUMsQ0FBQztBQUNKLENBQUM7QUFYRCwwREFXQztBQUVELFNBQWdCLHlCQUF5QixDQUFDLEVBQXlCO0lBQ2pFLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDM0QsT0FBTztRQUNMLElBQUksRUFBRSxpQkFBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7UUFDOUIsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsaUJBQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFDM0MsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMseUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFDN0MsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMseUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFDNUQsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMseUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFDbkQsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsbUJBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztRQUMxQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyx5QkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztLQUNwRCxDQUFDO0FBQ0osQ0FBQztBQVhELDhEQVdDIn0=