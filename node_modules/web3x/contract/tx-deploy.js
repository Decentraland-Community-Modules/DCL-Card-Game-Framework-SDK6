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
const sent_deploy_contract_tx_1 = require("./sent-deploy-contract-tx");
const tx_1 = require("./tx");
class TxDeploy extends tx_1.Tx {
    constructor(eth, contractEntry, contractAbi, deployData, args = [], defaultOptions = {}, onDeployed = x => x) {
        super(eth, contractEntry, contractAbi, undefined, args, defaultOptions);
        this.deployData = deployData;
        this.onDeployed = onDeployed;
    }
    send(options) {
        const sentTx = super.send(options);
        return new sent_deploy_contract_tx_1.SentDeployContractTx(this.eth, this.contractAbi, sentTx.getTxHash(), this.onDeployed);
    }
    encodeABI() {
        return Buffer.concat([this.deployData, this.contractEntry.encodeParameters(this.args)]);
    }
}
exports.TxDeploy = TxDeploy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHgtZGVwbG95LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnRyYWN0L3R4LWRlcGxveS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7OztFQWVFOztBQUtGLHVFQUFpRTtBQUNqRSw2QkFBdUQ7QUFFdkQsTUFBYSxRQUFTLFNBQVEsT0FBRTtJQUM5QixZQUNFLEdBQVEsRUFDUixhQUFvQyxFQUNwQyxXQUF3QixFQUNoQixVQUFrQixFQUMxQixPQUFjLEVBQUUsRUFDaEIsaUJBQWlDLEVBQUUsRUFDM0IsYUFBeUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXZELEtBQUssQ0FBQyxHQUFHLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBTGhFLGVBQVUsR0FBVixVQUFVLENBQVE7UUFHbEIsZUFBVSxHQUFWLFVBQVUsQ0FBcUM7SUFHekQsQ0FBQztJQUVNLElBQUksQ0FBQyxPQUFvQjtRQUM5QixNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25DLE9BQU8sSUFBSSw4Q0FBb0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLFNBQVMsRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNuRyxDQUFDO0lBRU0sU0FBUztRQUNkLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFGLENBQUM7Q0FDRjtBQXJCRCw0QkFxQkMifQ==