import { WearableRepresentation } from '../../platform/item/wearable';
/** @alpha */
export declare type WearableRepresentationDefinition = Omit<WearableRepresentation, 'contents'> & {
    contents: {
        key: string;
        url: string;
    }[];
};
//# sourceMappingURL=wearable-representation-definition.d.ts.map