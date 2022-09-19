"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRopstenCatalysts = exports.getMainnetCatalysts = void 0;
const CatalystContract_1 = require("../contracts/CatalystContract");
function getMainnetCatalysts() {
    return getServersFromNetwork('mainnet');
}
exports.getMainnetCatalysts = getMainnetCatalysts;
function getRopstenCatalysts() {
    return getServersFromNetwork('ropsten');
}
exports.getRopstenCatalysts = getRopstenCatalysts;
async function getServersFromNetwork(network) {
    const contract = CatalystContract_1.DAOContract.withNetwork(network);
    // Check count on the list
    const count = await contract.getCount();
    // Create an array with values from 0 to count - 1
    const indices = new Array(count).fill(0).map((_, i) => i);
    // Fetch data from the contract
    const dataPromises = indices.map((index) => contract.getCatalystIdByIndex(index).then((id) => contract.getServerData(id)));
    const data = await Promise.all(dataPromises);
    // Map and return
    return data.map(toMetadata).filter((metadata) => !!metadata);
}
/**
 * Converts the data from the contract into something more useful.
 * Returns undefined if the data from the contract is invalid.
 */
function toMetadata(data) {
    const { id, owner, domain } = data;
    let address = domain.trim();
    if (address.startsWith('http://')) {
        console.warn(`Catalyst node domain using http protocol, skipping ${address}`);
        return undefined;
    }
    if (!address.startsWith('https://')) {
        address = 'https://' + address;
    }
    return { address, owner, id };
}
//# sourceMappingURL=Catalysts.js.map