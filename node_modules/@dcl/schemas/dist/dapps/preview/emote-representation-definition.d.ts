import { EmoteRepresentationADR74 } from '../../platform';
/** @alpha */
export declare type EmoteRepresentationDefinition = Omit<EmoteRepresentationADR74, 'contents'> & {
    contents: {
        key: string;
        url: string;
    }[];
};
//# sourceMappingURL=emote-representation-definition.d.ts.map