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
const address_1 = require("../address");
const formatters_1 = require("../formatters");
const utils_1 = require("../utils");
const identity = () => (result) => result;
class EthRequestPayloads {
    constructor(defaultFromAddress, defaultBlock = 'latest') {
        this.defaultFromAddress = defaultFromAddress;
        this.defaultBlock = defaultBlock;
    }
    getDefaultBlock() {
        return this.defaultBlock;
    }
    setDefaultBlock(block) {
        this.defaultBlock = block;
    }
    getId() {
        return {
            method: 'net_version',
            format: utils_1.hexToNumber,
        };
    }
    getNodeInfo() {
        return {
            method: 'web3_clientVersion',
            format: identity(),
        };
    }
    getProtocolVersion() {
        return {
            method: 'eth_protocolVersion',
            format: identity(),
        };
    }
    getCoinbase() {
        return {
            method: 'eth_coinbase',
            format: address_1.Address.fromString,
        };
    }
    isMining() {
        return {
            method: 'eth_mining',
            format: identity(),
        };
    }
    getHashrate() {
        return {
            method: 'eth_hashrate',
            format: utils_1.hexToNumber,
        };
    }
    isSyncing() {
        return {
            method: 'eth_syncing',
            format: formatters_1.outputSyncingFormatter,
        };
    }
    getGasPrice() {
        return {
            method: 'eth_gasPrice',
            format: formatters_1.outputBigNumberFormatter,
        };
    }
    getAccounts() {
        return {
            method: 'eth_accounts',
            format: (result) => result.map(address_1.Address.fromString),
        };
    }
    getBlockNumber() {
        return {
            method: 'eth_blockNumber',
            format: utils_1.hexToNumber,
        };
    }
    getBalance(address, block) {
        return {
            method: 'eth_getBalance',
            params: [address.toString().toLowerCase(), formatters_1.inputBlockNumberFormatter(this.resolveBlock(block))],
            format: formatters_1.outputBigNumberFormatter,
        };
    }
    getStorageAt(address, position, block) {
        return {
            method: 'eth_getStorageAt',
            params: [
                address.toString().toLowerCase(),
                utils_1.numberToHex(position),
                formatters_1.inputBlockNumberFormatter(this.resolveBlock(block)),
            ],
            format: identity(),
        };
    }
    getCode(address, block) {
        return {
            method: 'eth_getCode',
            params: [address.toString().toLowerCase(), formatters_1.inputBlockNumberFormatter(this.resolveBlock(block))],
            format: identity(),
        };
    }
    getBlock(block, returnTransactionObjects = false) {
        return {
            method: util_1.isString(block) && utils_1.isHexStrict(block) ? 'eth_getBlockByHash' : 'eth_getBlockByNumber',
            params: [formatters_1.inputBlockNumberFormatter(this.resolveBlock(block)), returnTransactionObjects],
            format: formatters_1.fromRawBlockResponse,
        };
    }
    getUncle(block, uncleIndex, returnTransactionObjects = false) {
        return {
            method: util_1.isString(block) && utils_1.isHexStrict(block) ? 'eth_getUncleByBlockHashAndIndex' : 'eth_getUncleByBlockNumberAndIndex',
            params: [formatters_1.inputBlockNumberFormatter(this.resolveBlock(block)), utils_1.numberToHex(uncleIndex), returnTransactionObjects],
            format: formatters_1.fromRawBlockResponse,
        };
    }
    getBlockTransactionCount(block) {
        return {
            method: util_1.isString(block) && utils_1.isHexStrict(block)
                ? 'eth_getBlockTransactionCountByHash'
                : 'eth_getBlockTransactionCountByNumber',
            params: [formatters_1.inputBlockNumberFormatter(this.resolveBlock(block))],
            format: utils_1.hexToNumber,
        };
    }
    getBlockUncleCount(block) {
        return {
            method: util_1.isString(block) && utils_1.isHexStrict(block) ? 'eth_getUncleCountByBlockHash' : 'eth_getUncleCountByBlockNumber',
            params: [formatters_1.inputBlockNumberFormatter(this.resolveBlock(block))],
            format: utils_1.hexToNumber,
        };
    }
    getTransaction(hash) {
        return {
            method: 'eth_getTransactionByHash',
            params: [hash],
            format: formatters_1.fromRawTransactionResponse,
        };
    }
    getTransactionFromBlock(block, index) {
        return {
            method: util_1.isString(block) && utils_1.isHexStrict(block)
                ? 'eth_getTransactionByBlockHashAndIndex'
                : 'eth_getTransactionByBlockNumberAndIndex',
            params: [formatters_1.inputBlockNumberFormatter(block), utils_1.numberToHex(index)],
            format: formatters_1.fromRawTransactionResponse,
        };
    }
    getTransactionReceipt(hash) {
        return {
            method: 'eth_getTransactionReceipt',
            params: [hash],
            format: formatters_1.fromRawTransactionReceipt,
        };
    }
    getTransactionCount(address, block) {
        return {
            method: 'eth_getTransactionCount',
            params: [address.toString().toLowerCase(), formatters_1.inputBlockNumberFormatter(this.resolveBlock(block))],
            format: utils_1.hexToNumber,
        };
    }
    signTransaction(tx) {
        tx.from = tx.from || this.defaultFromAddress;
        return {
            method: 'eth_signTransaction',
            params: [formatters_1.toRawTransactionRequest(tx)],
            format: identity(),
        };
    }
    sendSignedTransaction(data) {
        return {
            method: 'eth_sendRawTransaction',
            params: [data],
            format: identity(),
        };
    }
    sendTransaction(tx) {
        const from = tx.from || this.defaultFromAddress;
        if (!from) {
            throw new Error('No from addres specified.');
        }
        return {
            method: 'eth_sendTransaction',
            params: [formatters_1.toRawTransactionRequest({ ...tx, from })],
            format: identity(),
        };
    }
    sign(address, dataToSign) {
        return {
            method: 'eth_sign',
            params: [address.toString().toLowerCase(), formatters_1.inputSignFormatter(dataToSign)],
            format: identity(),
        };
    }
    signTypedData(address, dataToSign) {
        return {
            method: 'eth_signTypedData',
            params: [dataToSign, address.toString().toLowerCase()],
            format: identity(),
        };
    }
    call(tx, block) {
        tx.from = tx.from || this.defaultFromAddress;
        return {
            method: 'eth_call',
            params: [formatters_1.toRawCallRequest(tx), formatters_1.inputBlockNumberFormatter(this.resolveBlock(block))],
            format: identity(),
        };
    }
    estimateGas(tx) {
        tx.from = tx.from || this.defaultFromAddress;
        return {
            method: 'eth_estimateGas',
            params: [formatters_1.toRawEstimateRequest(tx)],
            format: utils_1.hexToNumber,
        };
    }
    submitWork(nonce, powHash, digest) {
        return {
            method: 'eth_submitWork',
            params: [nonce, powHash, digest],
            format: identity(),
        };
    }
    getWork() {
        return {
            method: 'eth_getWork',
            format: identity(),
        };
    }
    getPastLogs(options) {
        return {
            method: 'eth_getLogs',
            params: [formatters_1.toRawLogRequest(options)],
            format: (result) => result.map(formatters_1.fromRawLogResponse),
        };
    }
    resolveBlock(block) {
        return block === undefined ? this.defaultBlock : block;
    }
}
exports.EthRequestPayloads = EthRequestPayloads;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXRoLXJlcXVlc3QtcGF5bG9hZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXRoL2V0aC1yZXF1ZXN0LXBheWxvYWRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7O0VBZUU7O0FBRUYsK0JBQWdDO0FBQ2hDLHdDQUFxQztBQUNyQyw4Q0FtQnVCO0FBR3ZCLG9DQUFpRTtBQUlqRSxNQUFNLFFBQVEsR0FBRyxHQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQVMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDO0FBRWhELE1BQWEsa0JBQWtCO0lBQzdCLFlBQW1CLGtCQUE0QixFQUFVLGVBQTBCLFFBQVE7UUFBeEUsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFVO1FBQVUsaUJBQVksR0FBWixZQUFZLENBQXNCO0lBQUcsQ0FBQztJQUV4RixlQUFlO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztJQUMzQixDQUFDO0lBRU0sZUFBZSxDQUFDLEtBQWdCO1FBQ3JDLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO0lBQzVCLENBQUM7SUFFTSxLQUFLO1FBQ1YsT0FBTztZQUNMLE1BQU0sRUFBRSxhQUFhO1lBQ3JCLE1BQU0sRUFBRSxtQkFBVztTQUNwQixDQUFDO0lBQ0osQ0FBQztJQUVNLFdBQVc7UUFDaEIsT0FBTztZQUNMLE1BQU0sRUFBRSxvQkFBb0I7WUFDNUIsTUFBTSxFQUFFLFFBQVEsRUFBVTtTQUMzQixDQUFDO0lBQ0osQ0FBQztJQUVNLGtCQUFrQjtRQUN2QixPQUFPO1lBQ0wsTUFBTSxFQUFFLHFCQUFxQjtZQUM3QixNQUFNLEVBQUUsUUFBUSxFQUFVO1NBQzNCLENBQUM7SUFDSixDQUFDO0lBRU0sV0FBVztRQUNoQixPQUFPO1lBQ0wsTUFBTSxFQUFFLGNBQWM7WUFDdEIsTUFBTSxFQUFFLGlCQUFPLENBQUMsVUFBVTtTQUMzQixDQUFDO0lBQ0osQ0FBQztJQUVNLFFBQVE7UUFD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