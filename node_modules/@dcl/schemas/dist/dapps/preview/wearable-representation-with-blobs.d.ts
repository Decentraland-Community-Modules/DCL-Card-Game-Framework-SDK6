import { WearableRepresentationDefinition } from './wearable-representation-definition';
/** @alpha */
export declare type WearableRepresentationWithBlobs = Omit<WearableRepresentationDefinition, 'contents'> & {
    contents: {
        key: string;
        blob: any;
    }[];
};
//# sourceMappingURL=wearable-representation-with-blobs.d.ts.map