import { Emote } from '../../platform';
import { EmoteRepresentationDefinition } from './emote-representation-definition';
export declare type EmoteDefinition = Omit<Emote, 'emoteDataADR74'> & {
    emoteDataADR74: Omit<Emote['emoteDataADR74'], 'representations'> & {
        representations: EmoteRepresentationDefinition[];
    };
};
//# sourceMappingURL=emote-definition.d.ts.map