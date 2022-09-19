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
const util_1 = require("util");
const abi_coder_1 = require("../abi-coder");
const contract_entry_1 = require("./contract-entry");
class ContractEventEntry extends contract_entry_1.ContractEntry {
    constructor(entry) {
        super(entry);
        this.signature = abi_coder_1.abiCoder.encodeEventSignature(abi_coder_1.abiCoder.abiMethodToString(entry));
    }
    getEventTopics(filter = {}) {
        const topics = [];
        if (!this.entry.anonymous && this.signature) {
            topics.push(this.signature);
        }
        const indexedTopics = (this.entry.inputs || [])
            .filter(input => input.indexed === true)
            .map(input => {
            const value = filter[input.name];
            if (!value) {
                return null;
            }
            // TODO: https://github.com/ethereum/web3.js/issues/344
            // TODO: deal properly with components
            if (util_1.isArray(value)) {
                return value.map(v => abi_coder_1.abiCoder.encodeParameter(input.type, v));
            }
            else {
                return abi_coder_1.abiCoder.encodeParameter(input.type, value);
            }
        });
        return [...topics, ...indexedTopics];
    }
    decodeEvent(log) {
        const { data = '', topics = [], ...formattedLog } = log;
        const { anonymous, inputs = [], name = '' } = this.entry;
        const argTopics = anonymous ? topics : topics.slice(1);
        const returnValues = abi_coder_1.abiCoder.decodeLog(inputs, data, argTopics);
        delete returnValues.__length__;
        return {
            ...formattedLog,
            event: name,
            returnValues,
            signature: anonymous || !topics[0] ? null : topics[0],
            raw: {
                data,
                topics,
            },
        };
    }
}
exports.ContractEventEntry = ContractEventEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3QtZXZlbnQtZW50cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29udHJhY3QvYWJpL2NvbnRyYWN0LWV2ZW50LWVudHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7O0VBZUU7O0FBRUYsK0JBQStCO0FBRS9CLDRDQUF3QztBQUV4QyxxREFBaUQ7QUFFakQsTUFBYSxrQkFBbUIsU0FBUSw4QkFBYTtJQUduRCxZQUFZLEtBQThCO1FBQ3hDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxTQUFTLEdBQUcsb0JBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxvQkFBUSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDcEYsQ0FBQztJQUVNLGNBQWMsQ0FBQyxTQUFpQixFQUFFO1FBQ3ZDLE1BQU0sTUFBTSxHQUEwQixFQUFFLENBQUM7UUFFekMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDN0I7UUFFRCxNQUFNLGFBQWEsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQzthQUM1QyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQzthQUN2QyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDWCxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ1YsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUVELHVEQUF1RDtZQUN2RCxzQ0FBc0M7WUFFdEMsSUFBSSxjQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ2xCLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLG9CQUFRLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNoRTtpQkFBTTtnQkFDTCxPQUFPLG9CQUFRLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDcEQ7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVMLE9BQU8sQ0FBQyxHQUFHLE1BQU0sRUFBRSxHQUFHLGFBQWEsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFTSxXQUFXLENBQUMsR0FBZ0I7UUFDakMsTUFBTSxFQUFFLElBQUksR0FBRyxFQUFFLEVBQUUsTUFBTSxHQUFHLEVBQUUsRUFBRSxHQUFHLFlBQVksRUFBRSxHQUFHLEdBQUcsQ0FBQztRQUN4RCxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sR0FBRyxFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFFekQsTUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsTUFBTSxZQUFZLEdBQUcsb0JBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNqRSxPQUFPLFlBQVksQ0FBQyxVQUFVLENBQUM7UUFFL0IsT0FBTztZQUNMLEdBQUcsWUFBWTtZQUNmLEtBQUssRUFBRSxJQUFJO1lBQ1gsWUFBWTtZQUNaLFNBQVMsRUFBRSxTQUFTLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNyRCxHQUFHLEVBQUU7Z0JBQ0gsSUFBSTtnQkFDSixNQUFNO2FBQ1A7U0FDRixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBdkRELGdEQXVEQyJ9