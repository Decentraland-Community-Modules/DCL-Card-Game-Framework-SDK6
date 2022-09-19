import { EmoteCategory } from '../emote-category';
import { JSONSchema, ValidateFunction } from '../../../../validation';
import { EmoteRepresentationADR74 } from './representation-adr74';
export declare type EmoteDataADR74 = {
    category: EmoteCategory;
    representations: EmoteRepresentationADR74[];
    tags: string[];
    loop: boolean;
};
export declare namespace EmoteDataADR74 {
    const schema: JSONSchema<EmoteDataADR74>;
    const validate: ValidateFunction<EmoteDataADR74>;
}
//# sourceMappingURL=emote-data-adr74.d.ts.map