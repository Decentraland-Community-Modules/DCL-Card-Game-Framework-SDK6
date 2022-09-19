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
const utils_1 = require("../../utils");
const abi_coder_1 = require("../abi-coder");
const contract_entry_1 = require("./contract-entry");
class ContractFunctionEntry extends contract_entry_1.ContractEntry {
    constructor(entry) {
        entry.inputs = entry.inputs || [];
        super(entry);
        this.signature =
            entry.type === 'constructor'
                ? 'constructor'
                : abi_coder_1.abiCoder.encodeFunctionSignature(abi_coder_1.abiCoder.abiMethodToString(entry));
    }
    get constant() {
        return this.entry.stateMutability === 'view' || this.entry.stateMutability === 'pure' || this.entry.constant;
    }
    get payable() {
        return this.entry.stateMutability === 'payable' || this.entry.payable;
    }
    numArgs() {
        return this.entry.inputs ? this.entry.inputs.length : 0;
    }
    decodeReturnValue(returnValue) {
        if (!returnValue) {
            return null;
        }
        const result = abi_coder_1.abiCoder.decodeParameters(this.entry.outputs, returnValue);
        if (result.__length__ === 1) {
            return result[0];
        }
        else {
            delete result.__length__;
            return result;
        }
    }
    encodeABI(args) {
        return Buffer.concat([utils_1.hexToBuffer(this.signature), this.encodeParameters(args)]);
    }
    encodeParameters(args) {
        return utils_1.hexToBuffer(abi_coder_1.abiCoder.encodeParameters(this.entry.inputs, args));
    }
    decodeParameters(bytes) {
        return abi_coder_1.abiCoder.decodeParameters(this.entry.inputs, utils_1.bufferToHex(bytes));
    }
}
exports.ContractFunctionEntry = ContractFunctionEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3QtZnVuY3Rpb24tZW50cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29udHJhY3QvYWJpL2NvbnRyYWN0LWZ1bmN0aW9uLWVudHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7O0VBZUU7O0FBRUYsdUNBQXVEO0FBQ3ZELDRDQUF3QztBQUV4QyxxREFBaUQ7QUFFakQsTUFBYSxxQkFBc0IsU0FBUSw4QkFBYTtJQUd0RCxZQUFZLEtBQThCO1FBQ3hDLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7UUFDbEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLFNBQVM7WUFDWixLQUFLLENBQUMsSUFBSSxLQUFLLGFBQWE7Z0JBQzFCLENBQUMsQ0FBQyxhQUFhO2dCQUNmLENBQUMsQ0FBQyxvQkFBUSxDQUFDLHVCQUF1QixDQUFDLG9CQUFRLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRUQsSUFBVyxRQUFRO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEtBQUssTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxLQUFLLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztJQUMvRyxDQUFDO0lBRUQsSUFBVyxPQUFPO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO0lBQ3hFLENBQUM7SUFFTSxPQUFPO1FBQ1osT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVNLGlCQUFpQixDQUFDLFdBQW1CO1FBQzFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDaEIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELE1BQU0sTUFBTSxHQUFHLG9CQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFMUUsSUFBSSxNQUFNLENBQUMsVUFBVSxLQUFLLENBQUMsRUFBRTtZQUMzQixPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNsQjthQUFNO1lBQ0wsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQ3pCLE9BQU8sTUFBTSxDQUFDO1NBQ2Y7SUFDSCxDQUFDO0lBRU0sU0FBUyxDQUFDLElBQVc7UUFDMUIsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsbUJBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRixDQUFDO0lBRU0sZ0JBQWdCLENBQUMsSUFBVztRQUNqQyxPQUFPLG1CQUFXLENBQUMsb0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxLQUFhO1FBQ25DLE9BQU8sb0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxtQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDMUUsQ0FBQztDQUNGO0FBbERELHNEQWtEQyJ9