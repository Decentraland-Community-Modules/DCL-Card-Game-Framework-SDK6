import { AuthChain } from '../misc/auth-chain';
import { JSONSchema, ValidateFunction } from '../validation';
/**
 * This type describes the minimum deployment + AuthChain needed to synchronize
 * a deployed entity across catalysts.
 * @public
 */
export declare type DeploymentWithAuthChain = {
    entityId: string;
    entityType: string;
    pointers: string[];
    localTimestamp: number;
    authChain: AuthChain;
};
/**
 * @public
 */
export declare namespace DeploymentWithAuthChain {
    const schema: JSONSchema<DeploymentWithAuthChain>;
    const validate: ValidateFunction<DeploymentWithAuthChain>;
}
//# sourceMappingURL=deployment-with-auth-chain.d.ts.map