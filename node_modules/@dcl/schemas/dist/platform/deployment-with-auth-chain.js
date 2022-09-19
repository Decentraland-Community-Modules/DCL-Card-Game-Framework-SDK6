"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeploymentWithAuthChain = void 0;
const auth_chain_1 = require("../misc/auth-chain");
const validation_1 = require("../validation");
/**
 * @public
 */
var DeploymentWithAuthChain;
(function (DeploymentWithAuthChain) {
    DeploymentWithAuthChain.schema = {
        type: 'object',
        properties: {
            entityId: { type: 'string' },
            entityType: { type: 'string' },
            pointers: { type: 'array', items: { type: 'string' }, minItems: 1 },
            localTimestamp: { type: 'number', minimum: 0 },
            authChain: auth_chain_1.AuthChain.schema
        },
        required: [
            'entityId',
            'entityType',
            'pointers',
            'localTimestamp',
            'authChain'
        ]
    };
    DeploymentWithAuthChain.validate = (0, validation_1.generateLazyValidator)(DeploymentWithAuthChain.schema);
})(DeploymentWithAuthChain = exports.DeploymentWithAuthChain || (exports.DeploymentWithAuthChain = {}));
//# sourceMappingURL=deployment-with-auth-chain.js.map