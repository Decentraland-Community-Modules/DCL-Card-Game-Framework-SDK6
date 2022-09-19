import { JSONSchema } from '../../../validation';
import { BaseItem } from '../base-item';
import { StandardProps } from '../standard-props';
import { ThirdPartyProps } from '../third-party-props';
import { EmoteDataADR74 } from './adr74/emote-data-adr74';
export declare type EmoteADR74 = BaseItem & (StandardProps | ThirdPartyProps) & {
    emoteDataADR74: EmoteDataADR74;
};
/** @alpha */
export declare type Emote = EmoteADR74;
/** @alpha */
export declare namespace Emote {
    const schema: JSONSchema<Emote>;
    const validate: import("../../../validation").ValidateFunction<EmoteADR74>;
}
//# sourceMappingURL=emote.d.ts.map