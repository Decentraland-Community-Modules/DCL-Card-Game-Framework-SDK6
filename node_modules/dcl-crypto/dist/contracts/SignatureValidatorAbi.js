"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contract_1 = require("web3x/contract");
exports.default = new contract_1.ContractAbi([
    {
        "constant": true,
        "inputs": [
            {
                "name": "hash",
                "type": "bytes32"
            },
            {
                "name": "_signature",
                "type": "bytes"
            }
        ],
        "name": "isValidSignature",
        "outputs": [
            {
                "name": "magicValue",
                "type": "bytes4"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
]);
//# sourceMappingURL=SignatureValidatorAbi.js.map