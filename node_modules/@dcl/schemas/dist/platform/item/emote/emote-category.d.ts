import { JSONSchema, ValidateFunction } from '../../../validation';
export declare enum EmoteCategory {
    DANCE = "dance",
    STUNT = "stunt",
    GREETINGS = "greetings",
    FUN = "fun",
    POSES = "poses",
    REACTIONS = "reactions",
    HORROR = "horror",
    MISCELLANEOUS = "miscellaneous"
}
export declare namespace EmoteCategory {
    const schema: JSONSchema<EmoteCategory>;
    const validate: ValidateFunction<EmoteCategory>;
}
//# sourceMappingURL=emote-category.d.ts.map