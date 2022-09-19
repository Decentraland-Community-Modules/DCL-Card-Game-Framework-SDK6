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
const eth_1 = require("../eth");
class SentContractTx extends eth_1.SentTransaction {
    constructor(eth, contractAbi, promise) {
        super(eth, promise);
        this.contractAbi = contractAbi;
    }
    async handleReceipt(receipt) {
        receipt = await super.handleReceipt(receipt);
        const { logs, to, contractAddress = to } = receipt;
        if (!util_1.isArray(logs)) {
            return receipt;
        }
        const isAnonymous = log => !log.address.equals(contractAddress) || !this.contractAbi.findEntryForLog(log);
        const anonymousLogs = logs.filter(isAnonymous);
        const events = logs.reduce((a, log) => {
            if (isAnonymous(log)) {
                return a;
            }
            const ev = this.contractAbi.decodeEvent(log);
            a[ev.event] = a[ev.event] || [];
            a[ev.event].push(ev);
            return a;
        }, {});
        delete receipt.logs;
        return { ...receipt, anonymousLogs, events };
    }
}
exports.SentContractTx = SentContractTx;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VudC1jb250cmFjdC10eC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cmFjdC9zZW50LWNvbnRyYWN0LXR4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7O0VBZUU7O0FBRUYsK0JBQStCO0FBQy9CLGdDQUE4QztBQUs5QyxNQUFhLGNBQWUsU0FBUSxxQkFBZTtJQUNqRCxZQUFZLEdBQVEsRUFBWSxXQUF3QixFQUFFLE9BQWlDO1FBQ3pGLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFEVSxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtJQUV4RCxDQUFDO0lBRVMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUEyQjtRQUN2RCxPQUFPLEdBQUcsTUFBTSxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLGVBQWUsR0FBRyxFQUFHLEVBQUUsR0FBRyxPQUFPLENBQUM7UUFFcEQsSUFBSSxDQUFDLGNBQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNsQixPQUFPLE9BQU8sQ0FBQztTQUNoQjtRQUVELE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRTFHLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFL0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUNwQyxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDcEIsT0FBTyxDQUFDLENBQUM7YUFDVjtZQUNELE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzdDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDaEMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDckIsT0FBTyxDQUFDLENBQUM7UUFDWCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFUCxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFFcEIsT0FBTyxFQUFFLEdBQUcsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsQ0FBQztJQUMvQyxDQUFDO0NBQ0Y7QUEvQkQsd0NBK0JDIn0=