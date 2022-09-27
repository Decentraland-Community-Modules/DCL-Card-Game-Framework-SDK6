/*      CARD GAME DATA
    holds definitions of all card games included in the module

    later, a card game's 'id' will be the identity used for on-server addressing
    of that game, so it should be unique between game types.
*/
export const data_card_game = 
[
    //freecell solitaire
    {
        //core
        //  identifier, unique int
        id:         "0",
        //  display name 
        name:       "FreeCell Solitaire",
        //  number of players game accepts
        players:    "1",
        //  game desc
        DescShort:  "Solitaire with a twist. FreeCell provides the player with 4 'freecells' that can hold any single card, but restricts the movement of player cards based on the number of available freecells. Unlike standard solitaire games, nearly every shuffle of freecell can be solved.",
        //  game win condition
        descWin:  "Victory is achieved by moving all cards into the endzone.",
        //  game rules
        descRules:  
        [
            "only a card of the next value and of the same house can enter the endzone, starting from ace to king.",
            "any single card can enter a freecell.",
            "only a card of the previous value and different house colour can be placed onto a card on the playzone.",
            "cards following the pattern of rule 3 can be moved in stacks, the size of which is: 1 + number of freecells"
        ]
    },
    //patience solitaire
    {
        //core
        id:         "1",
        name:       "Patience Solitaire",
        players:    "1",
        DescShort:  "The classic game of Solitaire. While most shuffles can be solved, it is very common to enter a stall and lose the game due to restrictive knowledge and movement rules.",
        descWin:  "Victory is achieved by moving all cards into the endzone.",
        descRules:  
        [
            "only a card of the next value and of the same house can enter the endzone, starting from ace to king.",
            "only a card of the previous value and different house colour can be placed onto a card on the playzone.",
            "cards following the pattern of rule 2 can be moved in stacks onto other cards",
            "cards following the pattern of rule 2 and a king at their base can be moved in stacks onto empty playzones"
        ]
    }
]