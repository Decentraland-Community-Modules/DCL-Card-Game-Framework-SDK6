"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eth_1 = require("web3x/eth");
class Blocks {
    constructor(eth, save = true) {
        this.eth = new eth_1.Eth(eth);
        this.checkedBlocks = {};
        this.saveBlocks = save;
        if (save) {
            this.savedBlocks = {};
        }
        this.requests = 0;
    }
    async fillBlockTime() {
        let latest = await this.getBlockWrapper('latest');
        let first = await this.getBlockWrapper(1);
        this.blockTime =
            (latest.timestamp - first.timestamp) / Number(latest.number) - 1;
        this.firstTimestamp = first.timestamp;
    }
    async getDate(date, after = true) {
        const dateInSeconds = date / 1000;
        const now = Date.now() / 1000;
        if (typeof this.firstTimestamp === 'undefined' ||
            typeof this.blockTime === 'undefined') {
            await this.fillBlockTime();
        }
        if (dateInSeconds < this.firstTimestamp) {
            return {
                block: 1,
                timestamp: dateInSeconds
            };
        }
        if (dateInSeconds >= now ||
            dateInSeconds > this.savedBlocks['latest'].timestamp) {
            return {
                block: await this.eth.getBlockNumber(),
                timestamp: dateInSeconds
            };
        }
        this.checkedBlocks[dateInSeconds] = [];
        let predictedBlock = await this.getBlockWrapper(Math.ceil((dateInSeconds - this.firstTimestamp / this.blockTime) / 1000));
        return {
            block: await this.findBetter(dateInSeconds, predictedBlock, after),
            timestamp: dateInSeconds
        };
    }
    async findBetter(date, predictedBlock, after, blockTime = this.blockTime) {
        if (await this.isBetterBlock(date, predictedBlock, after)) {
            return predictedBlock.number;
        }
        const difference = date - predictedBlock.timestamp;
        let skip = Math.ceil(difference / blockTime);
        if (skip === 0) {
            skip = difference < 0 ? -1 : 1;
        }
        const nextPredictedBlock = await this.getBlockWrapper(this.getNextBlock(date, predictedBlock.number, skip));
        blockTime = Math.abs((predictedBlock.timestamp - nextPredictedBlock.timestamp) /
            (predictedBlock.number - nextPredictedBlock.number));
        return this.findBetter(date, nextPredictedBlock, after, blockTime);
    }
    async isBetterBlock(date, predictedBlock, after) {
        const blockTime = predictedBlock.timestamp;
        if (after) {
            if (blockTime < date) {
                return false;
            }
            let previousBlock = await this.getBlockWrapper(predictedBlock.number - 1);
            if (blockTime >= date && previousBlock.timestamp < date) {
                return true;
            }
        }
        else {
            if (blockTime >= date) {
                return false;
            }
            let nextBlock = await this.getBlockWrapper(predictedBlock.number + 1);
            if (blockTime < date && nextBlock.timestamp >= date) {
                return true;
            }
        }
        return false;
    }
    getNextBlock(date, currentBlock, skip) {
        let nextBlock = currentBlock + skip;
        if (this.checkedBlocks[date].includes(nextBlock)) {
            return this.getNextBlock(date, currentBlock, skip < 0 ? ++skip : --skip);
        }
        this.checkedBlocks[date].push(nextBlock);
        return nextBlock;
    }
    async getBlockWrapper(block) {
        if (!this.saveBlocks) {
            const fetchedBlock = await this.eth.getBlock(block);
            return {
                number: fetchedBlock.number,
                timestamp: fetchedBlock.timestamp
            };
        }
        if (this.savedBlocks[block.toString()]) {
            return this.savedBlocks[block];
        }
        if (typeof block === 'number' &&
            this.savedBlocks['latest'] &&
            this.savedBlocks['latest'].number <= block) {
            return this.savedBlocks['latest'];
        }
        let { timestamp } = await this.eth.getBlock(block);
        this.savedBlocks[block.toString()] = {
            number: block === 'latest' ? await this.eth.getBlockNumber() : Number(block),
            timestamp
        };
        this.requests++;
        return this.savedBlocks[block.toString()];
    }
}
exports.default = Blocks;
//# sourceMappingURL=blocks.js.map