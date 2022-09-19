import { DisplayableDeployment } from '../shared/displayable';
import { I18N } from './i18n';
import { Metrics } from './metrics';
/**
 * @public
 *
 * Describes common properties to an item of a collection.
 */
export declare type BaseItem = DisplayableDeployment & {
    id: string;
    name: string;
    description: string;
    i18n: I18N[];
    thumbnail: string;
    image: string;
    metrics?: Metrics;
};
export declare const requiredBaseItemProps: readonly ["id", "name", "description", "i18n", "thumbnail", "image"];
//# sourceMappingURL=base-item.d.ts.map