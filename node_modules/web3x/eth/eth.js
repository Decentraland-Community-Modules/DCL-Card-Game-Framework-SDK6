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
const providers_1 = require("../providers");
const eth_request_payloads_1 = require("./eth-request-payloads");
const send_tx_1 = require("./send-tx");
const logs_1 = require("./subscriptions/logs");
const new_heads_1 = require("./subscriptions/new-heads");
const new_pending_transactions_1 = require("./subscriptions/new-pending-transactions");
const syncing_1 = require("./subscriptions/syncing");
class Eth {
    constructor(provider) {
        this.provider = provider;
        this.request = new eth_request_payloads_1.EthRequestPayloads(undefined, 'latest');
    }
    static fromCurrentProvider() {
        if (typeof web3 === 'undefined') {
            return;
        }
        const provider = web3.currentProvider || web3.ethereumProvider;
        if (!provider) {
            return;
        }
        return new Eth(new providers_1.LegacyProviderAdapter(provider));
    }
    get defaultFromAddress() {
        return this.request.defaultFromAddress;
    }
    set defaultFromAddress(address) {
        this.request.defaultFromAddress = address;
    }
    async send({ method, params, format }) {
        return format(await this.provider.send(method, params));
    }
    async getId() {
        return await this.send(this.request.getId());
    }
    async getNodeInfo() {
        return await this.send(this.request.getNodeInfo());
    }
    async getProtocolVersion() {
        return await this.send(this.request.getProtocolVersion());
    }
    async getCoinbase() {
        return await this.send(this.request.getCoinbase());
    }
    async isMining() {
        return await this.send(this.request.isMining());
    }
    async getHashrate() {
        return await this.send(this.request.getHashrate());
    }
    async isSyncing() {
        return await this.send(this.request.isSyncing());
    }
    async getGasPrice() {
        return await this.send(this.request.getGasPrice());
    }
    async getAccounts() {
        return await this.send(this.request.getAccounts());
    }
    async getBlockNumber() {
        return await this.send(this.request.getBlockNumber());
    }
    async getBalance(address, block) {
        return await this.send(this.request.getBalance(address, block));
    }
    async getStorageAt(address, position, block) {
        return await this.send(this.request.getStorageAt(address, position, block));
    }
    async getCode(address, block) {
        return await this.send(this.request.getCode(address, block));
    }
    async getBlock(block, returnTxs) {
        return await this.send(this.request.getBlock(block, returnTxs));
    }
    async getUncle(block, uncleIndex, returnTxs) {
        return await this.send(this.request.getUncle(block, uncleIndex, returnTxs));
    }
    async getBlockTransactionCount(block) {
        return await this.send(this.request.getBlockTransactionCount(block));
    }
    async getBlockUncleCount(block) {
        return await this.send(this.request.getBlockUncleCount(block));
    }
    async getTransaction(hash) {
        return await this.send(this.request.getTransaction(hash));
    }
    async getTransactionFromBlock(block, index) {
        return await this.send(this.request.getTransactionFromBlock(block, index));
    }
    async getTransactionReceipt(txHash) {
        return await this.send(this.request.getTransactionReceipt(txHash));
    }
    async getTransactionCount(address, block) {
        return await this.send(this.request.getTransactionCount(address, block));
    }
    async signTransaction(tx) {
        return await this.send(this.request.signTransaction(tx));
    }
    sendSignedTransaction(data) {
        const { method, params } = this.request.sendSignedTransaction(data);
        const txHashPromise = this.provider.send(method, params);
        return new send_tx_1.SentTransaction(this, txHashPromise);
    }
    sendTransaction(tx) {
        const promise = new Promise(async (resolve, reject) => {
            try {
                if (!tx.gasPrice) {
                    tx.gasPrice = await this.getGasPrice();
                }
                const account = this.getAccount(tx.from);
                if (!account) {
                    const { method, params, format } = this.request.sendTransaction(tx);
                    const txHash = format(await this.provider.send(method, params));
                    resolve(txHash);
                }
                else {
                    const { from, ...fromlessTx } = tx;
                    const signedTx = await account.signTransaction(fromlessTx, this);
                    const { method, params, format } = this.request.sendSignedTransaction(signedTx.rawTransaction);
                    const txHash = format(await this.provider.send(method, params));
                    resolve(txHash);
                }
            }
            catch (err) {
                reject(err);
            }
        });
        return new send_tx_1.SentTransaction(this, promise);
    }
    getAccount(address) {
        address = address || this.defaultFromAddress;
        if (this.wallet && address) {
            return this.wallet.get(address);
        }
    }
    async sign(address, dataToSign) {
        const account = this.getAccount(address);
        if (!account) {
            return await this.send(this.request.sign(address, dataToSign));
        }
        else {
            const sig = account.sign(dataToSign);
            return sig.signature;
        }
    }
    async signTypedData(address, dataToSign) {
        return await this.send(this.request.signTypedData(address, dataToSign));
    }
    async call(tx, block) {
        return await this.send(this.request.call(tx, block));
    }
    async estimateGas(tx) {
        return await this.send(this.request.estimateGas(tx));
    }
    async submitWork(nonce, powHash, digest) {
        return await this.send(this.request.submitWork(nonce, powHash, digest));
    }
    async getWork() {
        return await this.send(this.request.getWork());
    }
    async getPastLogs(options) {
        return await this.send(this.request.getPastLogs(options));
    }
    subscribe(type, ...args) {
        switch (type) {
            case 'logs':
                return logs_1.subscribeForLogs(this, ...args);
            case 'syncing':
                return syncing_1.subscribeForSyncing(this.provider);
            case 'newBlockHeaders':
                return new_heads_1.subscribeForNewHeads(this.provider);
            case 'pendingTransactions':
                return new_pending_transactions_1.subscribeForNewPendingTransactions(this.provider);
            default:
                throw new Error(`Unknown subscription type: ${type}`);
        }
    }
}
exports.Eth = Eth;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2V0aC9ldGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7RUFlRTs7QUFjRiw0Q0FBcUU7QUFNckUsaUVBQTREO0FBQzVELHVDQUFvRDtBQUNwRCwrQ0FBd0Q7QUFDeEQseURBQWlFO0FBQ2pFLHVGQUE4RjtBQUM5RixxREFBOEQ7QUFNOUQsTUFBYSxHQUFHO0lBSWQsWUFBcUIsUUFBMEI7UUFBMUIsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7UUFDN0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLHlDQUFrQixDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRU0sTUFBTSxDQUFDLG1CQUFtQjtRQUMvQixJQUFJLE9BQU8sSUFBSSxLQUFLLFdBQVcsRUFBRTtZQUMvQixPQUFPO1NBQ1I7UUFDRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztRQUMvRCxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2IsT0FBTztTQUNSO1FBQ0QsT0FBTyxJQUFJLEdBQUcsQ0FBQyxJQUFJLGlDQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELElBQVcsa0JBQWtCO1FBQzNCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztJQUN6QyxDQUFDO0lBRUQsSUFBVyxrQkFBa0IsQ0FBQyxPQUE0QjtRQUN4RCxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixHQUFHLE9BQU8sQ0FBQztJQUM1QyxDQUFDO0lBRU8sS0FBSyxDQUFDLElBQUksQ0FBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUE2RDtRQUN6RyxPQUFPLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFTSxLQUFLLENBQUMsS0FBSztRQUNoQixPQUFPLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVNLEtBQUssQ0FBQyxXQUFXO1FBQ3RCLE9BQU8sTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRU0sS0FBSyxDQUFDLGtCQUFrQjtRQUM3QixPQUFPLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRU0sS0FBSyxDQUFDLFdBQVc7UUFDdEIsT0FBTyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFTSxLQUFLLENBQUMsUUFBUTtRQUNuQixPQUFPLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVNLEtBQUssQ0FBQyxXQUFXO1FBQ3RCLE9BQU8sTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRU0sS0FBSyxDQUFDLFNBQVM7UUFDcEIsT0FBTyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFTSxLQUFLLENBQUMsV0FBVztRQUN0QixPQUFPLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVNLEtBQUssQ0FBQyxXQUFXO1FBQ3RCLE9BQU8sTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRU0sS0FBSyxDQUFDLGNBQWM7UUFDekIsT0FBTyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFTSxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQWdCLEVBQUUsS0FBaUI7UUFDekQsT0FBTyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVNLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBZ0IsRUFBRSxRQUFnQixFQUFFLEtBQWlCO1FBQzdFLE9BQU8sTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBRU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFnQixFQUFFLEtBQWlCO1FBQ3RELE9BQU8sTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFJTSxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQTRCLEVBQUUsU0FBbUI7UUFDckUsT0FBTyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQVlNLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBNEIsRUFBRSxVQUFrQixFQUFFLFNBQW1CO1FBQ3pGLE9BQU8sTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBRU0sS0FBSyxDQUFDLHdCQUF3QixDQUFDLEtBQTRCO1FBQ2hFLE9BQU8sTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsd0JBQXdCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRU0sS0FBSyxDQUFDLGtCQUFrQixDQUFDLEtBQTRCO1FBQzFELE9BQU8sTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRU0sS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFxQjtRQUMvQyxPQUFPLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFTSxLQUFLLENBQUMsdUJBQXVCLENBQUMsS0FBNEIsRUFBRSxLQUFhO1FBQzlFLE9BQU8sTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUVNLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxNQUF1QjtRQUN4RCxPQUFPLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUVNLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxPQUFnQixFQUFFLEtBQWlCO1FBQ2xFLE9BQU8sTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVNLEtBQUssQ0FBQyxlQUFlLENBQUMsRUFBc0I7UUFDakQsT0FBTyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRU0scUJBQXFCLENBQUMsSUFBWTtRQUN2QyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEUsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3pELE9BQU8sSUFBSSx5QkFBZSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRU0sZUFBZSxDQUFDLEVBQTZCO1FBQ2xELE1BQU0sT0FBTyxHQUFHLElBQUksT0FBTyxDQUFrQixLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3JFLElBQUk7Z0JBQ0YsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUU7b0JBQ2hCLEVBQUUsQ0FBQyxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7aUJBQ3hDO2dCQUVELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUV6QyxJQUFJLENBQUMsT0FBTyxFQUFFO29CQUNaLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNwRSxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDaEUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUNqQjtxQkFBTTtvQkFDTCxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDO29CQUNuQyxNQUFNLFFBQVEsR0FBRyxNQUFNLE9BQU8sQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUNqRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQztvQkFDL0YsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ2hFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDakI7YUFDRjtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNaLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNiO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLElBQUkseUJBQWUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVPLFVBQVUsQ0FBQyxPQUFpQjtRQUNsQyxPQUFPLEdBQUcsT0FBTyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztRQUM3QyxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksT0FBTyxFQUFFO1lBQzFCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDakM7SUFDSCxDQUFDO0lBRU0sS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFnQixFQUFFLFVBQWtCO1FBQ3BELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFekMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNaLE9BQU8sTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1NBQ2hFO2FBQU07WUFDTCxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3JDLE9BQU8sR0FBRyxDQUFDLFNBQVMsQ0FBQztTQUN0QjtJQUNILENBQUM7SUFFTSxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQWdCLEVBQUUsVUFBNEI7UUFDdkUsT0FBTyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVNLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBZSxFQUFFLEtBQWlCO1FBQ2xELE9BQU8sTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFTSxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQW1CO1FBQzFDLE9BQU8sTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVNLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBYSxFQUFFLE9BQWUsRUFBRSxNQUFjO1FBQ3BFLE9BQU8sTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRU0sS0FBSyxDQUFDLE9BQU87UUFDbEIsT0FBTyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFTSxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQW1CO1FBQzFDLE9BQU8sTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQU1NLFNBQVMsQ0FDZCxJQUFvRSxFQUNwRSxHQUFHLElBQVc7UUFFZCxRQUFRLElBQUksRUFBRTtZQUNaLEtBQUssTUFBTTtnQkFDVCxPQUFPLHVCQUFnQixDQUFDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQ3pDLEtBQUssU0FBUztnQkFDWixPQUFPLDZCQUFtQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM1QyxLQUFLLGlCQUFpQjtnQkFDcEIsT0FBTyxnQ0FBb0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDN0MsS0FBSyxxQkFBcUI7Z0JBQ3hCLE9BQU8sNkRBQWtDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNEO2dCQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLElBQUksRUFBRSxDQUFDLENBQUM7U0FDekQ7SUFDSCxDQUFDO0NBQ0Y7QUFwT0Qsa0JBb09DIn0=