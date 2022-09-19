"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthChain = exports.AuthLink = exports.AuthLinkType = void 0;
const validation_1 = require("../validation");
/**
 * @public
 */
var AuthLinkType;
(function (AuthLinkType) {
    AuthLinkType["SIGNER"] = "SIGNER";
    AuthLinkType["ECDSA_PERSONAL_EPHEMERAL"] = "ECDSA_EPHEMERAL";
    AuthLinkType["ECDSA_PERSONAL_SIGNED_ENTITY"] = "ECDSA_SIGNED_ENTITY";
    /**
     * See https://github.com/ethereum/EIPs/issues/1654
     */
    AuthLinkType["ECDSA_EIP_1654_EPHEMERAL"] = "ECDSA_EIP_1654_EPHEMERAL";
    /**
     * See https://github.com/ethereum/EIPs/issues/1654
     */
    AuthLinkType["ECDSA_EIP_1654_SIGNED_ENTITY"] = "ECDSA_EIP_1654_SIGNED_ENTITY";
    // https://github.com/ethereum/EIPs/issues/1654
})(AuthLinkType = exports.AuthLinkType || (exports.AuthLinkType = {}));
/**
 * @public
 */
var AuthLink;
(function (AuthLink) {
    AuthLink.schema = {
        type: 'object',
        properties: {
            type: {
                type: 'string',
                enum: Object.values(AuthLinkType)
            },
            payload: { type: 'string' },
            signature: { type: 'string', nullable: true }
        },
        required: ['payload', 'type'],
        if: {
            properties: { type: { not: { const: AuthLinkType.SIGNER } } }
        },
        then: {
            required: ['signature']
        },
        else: {
            // type = 'SIGNER' => signature = '' | null
            oneOf: [
                {
                    properties: { signature: { type: 'string', const: '' } },
                    required: ['signature']
                },
                { properties: { signature: { type: 'null' } } }
            ]
        }
    };
    AuthLink.validate = (0, validation_1.generateLazyValidator)(AuthLink.schema);
})(AuthLink = exports.AuthLink || (exports.AuthLink = {}));
/** @public */
var AuthChain;
(function (AuthChain) {
    AuthChain.schema = {
        type: 'array',
        items: AuthLink.schema,
        minItems: 1
    };
    AuthChain.validate = (0, validation_1.generateLazyValidator)(AuthChain.schema);
})(AuthChain = exports.AuthChain || (exports.AuthChain = {}));
//# sourceMappingURL=auth-chain.js.map