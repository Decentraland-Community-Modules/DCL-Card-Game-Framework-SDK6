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
const contract_1 = require("./contract");
const sent_contract_tx_1 = require("./sent-contract-tx");
class SentDeployContractTx extends sent_contract_tx_1.SentContractTx {
    constructor(eth, contractAbi, promise, onDeployed) {
        super(eth, contractAbi, promise);
        this.onDeployed = onDeployed;
    }
    async handleReceipt(receipt) {
        receipt = await super.handleReceipt(receipt);
        if (!receipt.contractAddress) {
            throw new Error('The contract deployment receipt did not contain a contract address.');
        }
        const code = await this.eth.getCode(receipt.contractAddress);
        if (code.length <= 2) {
            throw new Error(`Contract code could not be stored at ${receipt.contractAddress}.`);
        }
        this.onDeployed(receipt.contractAddress);
        return receipt;
    }
    async getContract() {
        const receipt = await this.getReceipt();
        return new contract_1.Contract(this.eth, this.contractAbi, receipt.contractAddress);
    }
}
exports.SentDeployContractTx = SentDeployContractTx;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VudC1kZXBsb3ktY29udHJhY3QtdHguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29udHJhY3Qvc2VudC1kZXBsb3ktY29udHJhY3QtdHgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7RUFlRTs7QUFPRix5Q0FBc0M7QUFDdEMseURBQW9EO0FBRXBELE1BQWEsb0JBQXFCLFNBQVEsaUNBQWM7SUFDdEQsWUFDRSxHQUFRLEVBQ1IsV0FBd0IsRUFDeEIsT0FBaUMsRUFDekIsVUFBc0M7UUFFOUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFGekIsZUFBVSxHQUFWLFVBQVUsQ0FBNEI7SUFHaEQsQ0FBQztJQUVTLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBMkI7UUFDdkQsT0FBTyxHQUFHLE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRTtZQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLHFFQUFxRSxDQUFDLENBQUM7U0FDeEY7UUFFRCxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUM3RCxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0NBQXdDLE9BQU8sQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDO1NBQ3JGO1FBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFekMsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVNLEtBQUssQ0FBQyxXQUFXO1FBQ3RCLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3hDLE9BQU8sSUFBSSxtQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDM0UsQ0FBQztDQUNGO0FBL0JELG9EQStCQyJ9