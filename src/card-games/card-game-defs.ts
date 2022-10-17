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
        descWin:    "Victory is achieved by moving all cards into the endzone.",
        //  game rules
        descRules:  
        [
            "only a card of the next value and of the same house can enter the endzone, starting from ace to king",
            "any single card can enter a freecell",
            "only a card of the previous value and different house colour can be placed onto a card on the playzone",
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
        descWin:    "Victory is achieved by moving all cards into the endzone.",
        descRules:  
        [
            "only a card of the next value and of the same house can enter the endzone, starting from ace to king",
            "only a card of the previous value and different house colour can be placed onto a card on the playzone",
            "cards following the pattern of rule 2 can be moved in stacks onto other cards",
            "cards following the pattern of rule 2 and a king at their base can be moved in stacks onto empty playzones"
        ]
    },
    //spider solitaire
    {
        //core
        id:         "2",
        name:       "Spider Solitaire",
        players:    "1",
        DescShort:  "Spider is a modified variant of Patience which uses 2 decks instead of one and reserve cards are added to the play field when uncovered.",
        descWin:    "Victory is achieved by moving every full card set into the endzone.",
        descRules:  
        [
            "only a card of the next value can placed on another card, house is not considered for placement",
            "cards of ordered value and of the same house can be moved in stacks",
            "any card or card stack can be placed into an empty playzone",
            "when a full card set is created (ace to king of same house) it will automatically be moved into the endzone"
        ]
    },
    //accordion solitaire
    {
        //core
        id:         "3",
        name:       "Accordion Solitaire",
        players:    "1",
        DescShort:  "Accordian is a unique form of solitaire where all cards exist in a single winding slide of cards. It's game rules create a challenging environment where the player must think several steps ahead to achieve victory.",
        descWin:    "Victory is achieved by only having a single card left in the playzone.",
        descRules:  
        [
            "a card can replace another card of the same house or value either 1 or 3 positions ahead of it, the replaced card is then discarded"
        ]
    },
    //pyramid solitaire
    {
        //core
        id:         "4",
        name:       "Pyramid Solitaire",
        players:    "1",
        DescShort:  "Pyramid is a mathematical matching game where the player attempts to remove all cards from the playing field while purging all cards within their deck.",
        descWin:    "Victory is achieved by clearing the pyramid and moving all cards into the endzone.",
        descRules:  
        [
            "any card pairings equaling the value of 13 can be removed from play. as an exampe, an Ace (1) and Queen (12) can be paired and removed from play, while a King (13) can be removed without a partner"
        ]
    },
    //tri peaks solitaire
    {
        //core
        id:         "5",
        name:       "Tri Peaks Solitaire",
        players:    "1",
        DescShort:  "Tri Peaks is a modified varient of Pyramid, providing the player with more avenues for strategy and a much better chance of not getting a bricked shuffle.",
        descWin:    "Victory is achieved by clearing the pyramids and moving all cards into the endzone.",
        descRules:
        [
            "any card pairings equaling the value of 13 can be removed from play. as an exampe, an Ace (1) and Queen (12) can be paired and removed from play, while a King (13) can be removed without a partner"
        ]
    }
]