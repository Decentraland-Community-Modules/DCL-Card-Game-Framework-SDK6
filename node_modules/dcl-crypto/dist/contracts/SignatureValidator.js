"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const contract_1 = require("web3x/contract");
const SignatureValidatorAbi_1 = __importDefault(require("./SignatureValidatorAbi"));
class SignatureValidator extends contract_1.Contract {
    constructor(eth, address, options) {
        super(eth, SignatureValidatorAbi_1.default, address, options);
    }
}
exports.SignatureValidator = SignatureValidator;
exports.SignatureValidatorAbi = SignatureValidatorAbi_1.default;
//# sourceMappingURL=SignatureValidator.js.map