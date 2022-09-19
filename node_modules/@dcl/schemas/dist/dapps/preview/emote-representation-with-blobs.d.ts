import { EmoteRepresentationDefinition } from './emote-representation-definition';
/** @alpha */
export declare type EmoteRepresentationWithBlobs = Omit<EmoteRepresentationDefinition, 'contents'> & {
    contents: {
        key: string;
        blob: any;
    }[];
};
//# sourceMappingURL=emote-representation-with-blobs.d.ts.map