import { EmoteDefinition } from './emote-definition';
import { EmoteRepresentationWithBlobs } from './emote-representation-with-blobs';
/** @alpha */
export declare type EmoteWithBlobs = Omit<EmoteDefinition, 'emoteDataADR74'> & {
    emoteDataADR74: Omit<EmoteDefinition['emoteDataADR74'], 'representations'> & {
        representations: EmoteRepresentationWithBlobs[];
    };
};
//# sourceMappingURL=emote-with-blobs.d.ts.map