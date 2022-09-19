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
const _1 = require(".");
const utils_1 = require("../../utils");
class ContractAbi {
    constructor(definition) {
        this.functions = definition.filter(e => e.type === 'function').map(entry => new _1.ContractFunctionEntry(entry));
        this.events = definition.filter(e => e.type === 'event').map(entry => new _1.ContractEventEntry(entry));
        const ctor = definition.find(e => e.type === 'constructor');
        this.ctor = new _1.ContractFunctionEntry(ctor || { type: 'constructor' });
        const fallback = definition.find(e => e.type === 'fallback');
        if (fallback) {
            this.fallback = new _1.ContractFunctionEntry(fallback);
        }
    }
    findEntryForLog(log) {
        return this.events.find(abiDef => abiDef.signature === log.topics[0]);
    }
    decodeEvent(log) {
        const event = this.findEntryForLog(log);
        if (!event) {
            throw new Error(`Unable to find matching event signature for log: ${log.id}`);
        }
        return event.decodeEvent(log);
    }
    decodeFunctionData(data) {
        const funcSig = utils_1.bufferToHex(data.slice(0, 4));
        const func = this.functions.find(f => f.signature === funcSig);
        return func ? func.decodeParameters(data.slice(4)) : undefined;
    }
}
exports.ContractAbi = ContractAbi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3QtYWJpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbnRyYWN0L2FiaS9jb250cmFjdC1hYmkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7RUFlRTs7QUFFRix3QkFBcUY7QUFFckYsdUNBQTBDO0FBRTFDLE1BQWEsV0FBVztJQU10QixZQUFZLFVBQWlDO1FBQzNDLElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSx3QkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzlHLElBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxxQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3JHLE1BQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLGFBQWEsQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSx3QkFBcUIsQ0FBQyxJQUFJLElBQUksRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQztRQUN2RSxNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxVQUFVLENBQUMsQ0FBQztRQUM3RCxJQUFJLFFBQVEsRUFBRTtZQUNaLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSx3QkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNyRDtJQUNILENBQUM7SUFFTSxlQUFlLENBQUMsR0FBZ0I7UUFDckMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEtBQUssR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFTSxXQUFXLENBQUMsR0FBZ0I7UUFDakMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyxvREFBb0QsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDL0U7UUFDRCxPQUFPLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVNLGtCQUFrQixDQUFDLElBQVk7UUFDcEMsTUFBTSxPQUFPLEdBQUcsbUJBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxPQUFPLENBQUMsQ0FBQztRQUMvRCxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ2pFLENBQUM7Q0FDRjtBQWxDRCxrQ0FrQ0MifQ==