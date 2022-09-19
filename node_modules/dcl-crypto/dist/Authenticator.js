"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eth_crypto_1 = require("eth-crypto");
const eth_1 = require("web3x/eth");
const address_1 = require("web3x/address");
const SignatureValidator_1 = require("./contracts/SignatureValidator");
const types_1 = require("./types");
const utils_1 = require("./helper/utils");
const blocks_1 = __importDefault(require("./helper/blocks"));
exports.VALID_SIGNATURE = 'VALID_SIGNATURE';
const PERSONAL_SIGNATURE_LENGTH = 132;
class Authenticator {
    /** Validate that the signature belongs to the Ethereum address */
    static async validateSignature(expectedFinalAuthority, authChain, provider, dateToValidateExpirationInMillis = Date.now()) {
        let currentAuthority = '';
        if (!Authenticator.isValidAuthChain(authChain)) {
            return {
                ok: false,
                message: 'ERROR: Malformed authChain'
            };
        }
        for (let authLink of authChain) {
            const validator = getValidatorByType(authLink.type);
            try {
                const { nextAuthority } = await validator(currentAuthority, authLink, {
                    provider,
                    dateToValidateExpirationInMillis
                });
                currentAuthority = nextAuthority ? nextAuthority : '';
            }
            catch (e) {
                return {
                    ok: false,
                    message: `ERROR. Link type: ${authLink.type}. ${e.message}.`
                };
            }
        }
        const ok = currentAuthority === expectedFinalAuthority;
        return {
            ok,
            message: ok
                ? undefined
                : `ERROR: Invalid final authority. Expected: ${expectedFinalAuthority}. Current ${currentAuthority}.`
        };
    }
    static isValidAuthChain(authChain) {
        for (const [index, authLink] of authChain.entries()) {
            // SIGNER should be the first one
            if (index === 0 && authLink.type !== types_1.AuthLinkType.SIGNER) {
                return false;
            }
            // SIGNER should be unique
            if (authLink.type === types_1.AuthLinkType.SIGNER && index !== 0) {
                return false;
            }
        }
        return true;
    }
    static createEthereumMessageHash(msg) {
        let msgWithPrefix = `\x19Ethereum Signed Message:\n${msg.length}${msg}`;
        const msgHash = eth_crypto_1.hash.keccak256(msgWithPrefix);
        return msgHash;
    }
    // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1271.md
    static createEIP1271MessageHash(msg) {
        return eth_crypto_1.hash.keccak256([
            {
                type: 'string',
                value: msg
            }
        ]);
    }
    static createSimpleAuthChain(finalPayload, ownerAddress, signature) {
        return [
            {
                type: types_1.AuthLinkType.SIGNER,
                payload: ownerAddress,
                signature: ''
            },
            {
                type: getSignedIdentitySignatureType(signature),
                payload: finalPayload,
                signature: signature
            }
        ];
    }
    static createAuthChain(ownerIdentity, ephemeralIdentity, ephemeralMinutesDuration, entityId) {
        const expiration = utils_1.moveMinutes(ephemeralMinutesDuration);
        const ephemeralMessage = Authenticator.getEphemeralMessage(ephemeralIdentity.address, expiration);
        const firstSignature = Authenticator.createSignature(ownerIdentity, ephemeralMessage);
        const secondSignature = Authenticator.createSignature(ephemeralIdentity, entityId);
        const authChain = [
            {
                type: types_1.AuthLinkType.SIGNER,
                payload: ownerIdentity.address,
                signature: ''
            },
            {
                type: types_1.AuthLinkType.ECDSA_PERSONAL_EPHEMERAL,
                payload: ephemeralMessage,
                signature: firstSignature
            },
            {
                type: types_1.AuthLinkType.ECDSA_PERSONAL_SIGNED_ENTITY,
                payload: entityId,
                signature: secondSignature
            }
        ];
        return authChain;
    }
    static async initializeAuthChain(ethAddress, ephemeralIdentity, ephemeralMinutesDuration, signer) {
        let expiration = new Date();
        expiration.setMinutes(expiration.getMinutes() + ephemeralMinutesDuration);
        const ephemeralMessage = Authenticator.getEphemeralMessage(ephemeralIdentity.address, expiration);
        const firstSignature = await signer(ephemeralMessage);
        const authChain = [
            { type: types_1.AuthLinkType.SIGNER, payload: ethAddress, signature: '' },
            {
                type: getEphemeralSignatureType(firstSignature),
                payload: ephemeralMessage,
                signature: firstSignature
            }
        ];
        return {
            ephemeralIdentity,
            expiration,
            authChain
        };
    }
    static signPayload(authIdentity, entityId) {
        const secondSignature = Authenticator.createSignature(authIdentity.ephemeralIdentity, entityId);
        return [
            ...authIdentity.authChain,
            {
                type: types_1.AuthLinkType.ECDSA_PERSONAL_SIGNED_ENTITY,
                payload: entityId,
                signature: secondSignature
            }
        ];
    }
    static createSignature(identity, message) {
        return eth_crypto_1.sign(identity.privateKey, Authenticator.createEthereumMessageHash(message));
    }
    static ownerAddress(authChain) {
        if (authChain.length > 0) {
            if (authChain[0].type === types_1.AuthLinkType.SIGNER) {
                return authChain[0].payload;
            }
        }
        return 'Invalid-Owner-Address';
    }
    static getEphemeralMessage(ephemeralAddress, expiration) {
        return `Decentraland Login\nEphemeral address: ${ephemeralAddress}\nExpiration: ${expiration.toISOString()}`;
    }
}
exports.Authenticator = Authenticator;
exports.SIGNER_VALIDATOR = async (_, authLink) => {
    return { nextAuthority: authLink.payload };
};
exports.ECDSA_SIGNED_ENTITY_VALIDATOR = async (authority, authLink) => {
    const signerAddress = eth_crypto_1.recover(sanitizeSignature(authLink.signature), Authenticator.createEthereumMessageHash(authLink.payload));
    const expectedSignedAddress = authority.toLocaleLowerCase();
    const actualSignedAddress = signerAddress.toLocaleLowerCase();
    if (expectedSignedAddress === actualSignedAddress) {
        return { nextAuthority: authLink.payload };
    }
    throw new Error(`Invalid signer address. Expected: ${expectedSignedAddress}. Actual: ${actualSignedAddress}`);
};
exports.ECDSA_PERSONAL_EPHEMERAL_VALIDATOR = async (authority, authLink, options) => {
    const { message, ephemeralAddress, expiration } = parseEmphemeralPayload(authLink.payload);
    const dateToValidateExpirationInMillis = options
        .dateToValidateExpirationInMillis
        ? options.dateToValidateExpirationInMillis
        : Date.now();
    if (expiration > dateToValidateExpirationInMillis) {
        const signerAddress = eth_crypto_1.recover(sanitizeSignature(authLink.signature), Authenticator.createEthereumMessageHash(message));
        const expectedSignedAddress = authority.toLocaleLowerCase();
        const actualSignedAddress = signerAddress.toLocaleLowerCase();
        if (expectedSignedAddress === actualSignedAddress) {
            return { nextAuthority: ephemeralAddress };
        }
        throw new Error(`Invalid signer address. Expected: ${expectedSignedAddress}. Actual: ${actualSignedAddress}`);
    }
    throw new Error(`Ephemeral key expired. Expiration: ${expiration}. Test: ${dateToValidateExpirationInMillis}`);
};
exports.ECDSA_EIP_1654_EPHEMERAL_VALIDATOR = async (authority, authLink, options) => {
    var _a, _b;
    const { message, ephemeralAddress, expiration } = parseEmphemeralPayload(authLink.payload);
    const dateToValidateExpirationInMillis = ((_a = options) === null || _a === void 0 ? void 0 : _a.dateToValidateExpirationInMillis) ? (_b = options) === null || _b === void 0 ? void 0 : _b.dateToValidateExpirationInMillis : Date.now();
    if (expiration > dateToValidateExpirationInMillis) {
        if (await isValidEIP1654Message(options.provider, authority, message, authLink.signature, dateToValidateExpirationInMillis)) {
            return { nextAuthority: ephemeralAddress };
        }
    }
    throw new Error(`Ephemeral key expired. Expiration: ${expiration}. Test: ${dateToValidateExpirationInMillis}`);
};
exports.EIP_1654_SIGNED_ENTITY_VALIDATOR = async (authority, authLink, options) => {
    if (await isValidEIP1654Message(options.provider, authority, authLink.payload, authLink.signature, options.dateToValidateExpirationInMillis)) {
        return { nextAuthority: authLink.payload };
    }
    throw new Error(`Invalid validation`);
};
const ERROR_VALIDATOR = async (_, __) => {
    return { error: 'Error Validator.' };
};
function getEphemeralSignatureType(signature) {
    if (signature.length === PERSONAL_SIGNATURE_LENGTH) {
        return types_1.AuthLinkType.ECDSA_PERSONAL_EPHEMERAL;
    }
    else {
        return types_1.AuthLinkType.ECDSA_EIP_1654_EPHEMERAL;
    }
}
exports.getEphemeralSignatureType = getEphemeralSignatureType;
function getSignedIdentitySignatureType(signature) {
    if (signature.length === PERSONAL_SIGNATURE_LENGTH) {
        return types_1.AuthLinkType.ECDSA_PERSONAL_SIGNED_ENTITY;
    }
    else {
        return types_1.AuthLinkType.ECDSA_EIP_1654_SIGNED_ENTITY;
    }
}
exports.getSignedIdentitySignatureType = getSignedIdentitySignatureType;
function parseEmphemeralPayload(payload) {
    // authLink payload structure: <human-readable message >\nEphemeral address: <ephemeral-eth - address >\nExpiration: <timestamp>
    // authLink payload example: Decentraland Login\nEphemeral address: 0x123456\nExpiration: 2020 - 01 - 20T22: 57: 11.334Z
    const message = payload.replace(/\r/g, '');
    const payloadParts = message.split('\n');
    const ephemeralAddress = payloadParts[1].substring('Ephemeral address: '.length);
    const expirationString = payloadParts[2].substring('Expiration: '.length);
    const expiration = Date.parse(expirationString);
    return { message, ephemeralAddress, expiration };
}
exports.parseEmphemeralPayload = parseEmphemeralPayload;
function sanitizeSignature(signature) {
    let sanitizedSignature = signature;
    const version = parseInt(signature.slice(-2), 16);
    if (version === 0 || version === 1) {
        sanitizedSignature =
            signature.substr(0, signature.length - 2) + (version + 27).toString(16);
    }
    return sanitizedSignature;
}
async function isValidEIP1654Message(provider, contractAddress, message, signature, dateToValidateExpirationInMillis) {
    // bytes4(keccak256("isValidSignature(bytes32,bytes)")
    const ERC1654_MAGIC_VALUE = '0x1626ba7e';
    if (!provider) {
        throw new Error('Missing provider');
    }
    const eth = new eth_1.Eth(provider);
    const signatureValidator = new SignatureValidator_1.SignatureValidator(eth, address_1.Address.fromString(contractAddress));
    const hashedMessage = Authenticator.createEIP1271MessageHash(message);
    let result = await signatureValidator.methods
        .isValidSignature(hashedMessage, signature)
        .call();
    if (result === ERC1654_MAGIC_VALUE) {
        return true;
    }
    else {
        // check based on the dateToValidateExpirationInMillis
        const dater = new blocks_1.default(provider);
        try {
            const { block } = await dater.getDate(dateToValidateExpirationInMillis, false);
            result = await signatureValidator.methods
                .isValidSignature(hashedMessage, signature)
                .call({}, block);
        }
        catch (e) {
            throw new Error(`Invalid validation. Error: ${e.message}`);
        }
        if (result === ERC1654_MAGIC_VALUE) {
            return true;
        }
        throw new Error(`Invalid validation. Expected: ${ERC1654_MAGIC_VALUE}. Actual: ${result}`);
    }
}
function getValidatorByType(type) {
    switch (type) {
        case types_1.AuthLinkType.SIGNER:
            return exports.SIGNER_VALIDATOR;
        case types_1.AuthLinkType.ECDSA_PERSONAL_EPHEMERAL:
            return exports.ECDSA_PERSONAL_EPHEMERAL_VALIDATOR;
        case types_1.AuthLinkType.ECDSA_PERSONAL_SIGNED_ENTITY:
            return exports.ECDSA_SIGNED_ENTITY_VALIDATOR;
        case types_1.AuthLinkType.ECDSA_EIP_1654_EPHEMERAL:
            return exports.ECDSA_EIP_1654_EPHEMERAL_VALIDATOR;
        case types_1.AuthLinkType.ECDSA_EIP_1654_SIGNED_ENTITY:
            return exports.EIP_1654_SIGNED_ENTITY_VALIDATOR;
        default:
            return ERROR_VALIDATOR;
    }
}
//# sourceMappingURL=Authenticator.js.map