/*      PATIENCE SOLITAIRE CARD GAME MANAGER
    represents the logic/game rules of the game of solitaire, patience style. 
    this game must be hosted via the game table module. 
    -it's called patience because you really need patience to soak the 12.5% win ratio-
*/
//import { Card } from "src/card-game-core/card";
//import { CardCollection } from "src/card-game-core/card-collection";
import { Card } from "src/card-game-core/card";
import { CardCollection } from "src/card-game-core/card-collection";
import { CardGameManager } from "src/card-game-core/card-game-manager";
export class CardGameManagerSolitairePatience extends CardGameManager
{
    //display text used for displaying current game state
    //  'in-progress/win/loss' should only be seen, but also provides some debugging info if crashes at certain state
    textGameState:TextShape;

    //constructor
    constructor(parent:Entity, textGameState:TextShape)
    {
        //base constructor
        super(parent);
        this.gameName = "Patience";
        if(this.isDebugging) { log("solitaire manager - initializing"); }

        this.textGameState = textGameState;
        this.textGameState.value = "Initializing...";

        //create required collections
        //  create a single deck
        this.AddCollection(0, 0);
        //  create 4 stacks for endzone, each only accepts a single house and requires a straight input
        for (let i = 0; i < 4; i++) 
        {
            //create collection
            this.AddCollection(2, i);
            //set object position details
            this.cardObjectManager.SetGroupObjectPosition(2, i, 0, new Vector3(1.36-(i*0.4525), 0.05, 1.45));
            this.cardObjectManager.SetGroupCardPosition(2, i, 0, new Vector3(0, 0.01, 0));
            this.cardObjectManager.SetGroupCardPosition(2, i, 1, new Vector3(0, 0.001, 0));
            //set restriction details
            //  change visibility
            this.GetCollection(2, i).visibilityType = 1;
            //  only allow a single house in straight order
            this.GetCollection(2, i).placementTypePrimary = 1;
            this.GetCollection(2, i).placementTypeSecondary = i;
       }
        //  create 2 stacks for deck and discard
        for (let i = 0; i < 2; i++) 
        {
            //create collection
            this.AddCollection(2, i+4);
            //set object position details
            this.cardObjectManager.SetGroupObjectPosition(2, i+4, 0, new Vector3(-1.36+(i*0.4525), 0.05, 1.45));
            this.cardObjectManager.SetGroupCardPosition(2, i+4, 0, new Vector3(0, 0.01, 0));
            //positioning is sperate for deck vs discard stacks
            if(i == 0) this.cardObjectManager.SetGroupCardPosition(2, i+4, 1, new Vector3(0, 0.00, 0));
            if(i == 1) this.cardObjectManager.SetGroupCardPosition(2, i+4, 1, new Vector3(0, 0.001, 0));
            //set restriction details
            //  change card limit
            this.GetCollection(2, i).cardMaxCount = 1;
            //  change visibility
            this.GetCollection(2, i).visibilityType = 1;
            //  only allow a single house in straight order
            this.GetCollection(2, i).placementTypePrimary = 0;
            this.GetCollection(2, i).placementTypeSecondary = 0;
        }
        //  create 7 slides for playing field
        for (let i = 0; i < 7; i++) 
        {
            //create collection
            this.AddCollection(3, i);
            //set object position details
            this.cardObjectManager.SetGroupObjectPosition(3, i, 0, new Vector3(-1.36+(i*0.4525), 0.05, 0.90));
            this.cardObjectManager.SetGroupCardPosition(3, i, 0, new Vector3(0, 0.01, 0));
            this.cardObjectManager.SetGroupCardPosition(3, i, 1, new Vector3(0, 0.001, -0.20));
            //set restriction details
            //  change visibility
            this.GetCollection(3, i).visibilityType = 1;
            //  only allow a single house in straight order
            this.GetCollection(3, i).placementTypePrimary = 3;
            this.GetCollection(3, i).placementTypeSecondary = 0;
        }
        this.textGameState.value = "Initialized...";
        if(this.isDebugging) { log("solitaire manager - initialized"); }
    }

    //begins a new game, shuffling deck and placing cards
    public NewGame()
    {
        if(this.isDebugging) { log("solitaire manager - new game starting"); }
        this.textGameState.value = "Starting New Game...";
        //set defualt state
        this.Reset();

        //shuffle cards
        this.cardDecks.getItem(0).ShuffleCards();

        //sort required cards across standard playzones
        let house:number;
        let value:number;
        let count:number = 0;
        let size:number = 0;
        if(this.isDebugging) { log("solitaire manager - deck size "+this.GetCollection(0,0).cardList.size().toString()); }
        for (let i = 0; i < this.cardSlides.size(); i++) 
        {
            //add next amount of cards to current slide
            size++;
            for (let j = 0; j < size; j++) 
            {
                //get next card from deck
                house = this.GetCardFromCollection(0,0,count).House;
                value = this.GetCardFromCollection(0,0,count).Value;
                this.MoveCard
                (
                    0,
                    house,
                    value,
                    3,
                    i%7
                );
                //all cards hidden, except those at the end of the slide
                if(j == size-1) this.GetCardObject(0, house, value).SetFaceState(true);
                else this.GetCardObject(0, house, value).SetFaceState(false);
                //push next card
                count++;
            }
        }

        //push remaining cards into deck stack
        for (let i = count; i < this.cardDecks.getItem(0).cardList.size(); i++) 
        {
            //get next card from deck
            house = this.GetCardFromCollection(0,0,i).House;
            value = this.GetCardFromCollection(0,0,i).Value;
            this.MoveCard
            (
                0,
                house,
                value,
                2,
                4
            );
            //all cards hidden
            this.GetCardObject(0, house, value).SetFaceState(false);
        }

        //display all valid moves
        this.DisplayMoves();
        this.textGameState.value = "In Progress";

        if(this.isDebugging) { log("solitaire manager - new game started"); }
    }

    //creates a preview of all possible moves available with the currently selected card, highlighting all moves
    //  this function contains all rules regarding card placement on the table and checking victory conditions
    public DisplayMoves()
    {
        if(this.isDebugging) { log("solitaire manager - displaying all possible selections"); }
        let card:Card;
        let collection:CardCollection;

        //clear all previously displayed moves
        //  all groups
        for (let i = 0; i < this.cardStacks.size(); i++) 
        {
            this.GetGroupObject(2, i).SetInteractionState(false);
            this.GetGroupObject(2, i).SetInteractionViewState(false);
        }
        for (let i = 0; i < this.cardSlides.size(); i++) 
        {
            this.GetGroupObject(3, i).SetInteractionState(false);
            this.GetGroupObject(3, i).SetInteractionViewState(false);
        }
        //  all cards, processing by house and value
        for (let i = 0; i < Card.STRINGS_HOUSES.length; i++) 
        {
            for (let j = 0; j < Card.STRINGS_VALUES.length; j++) 
            {
                this.GetCardObject(0, i, j).SetInteractionState(false);
                this.GetCardObject(0, i, j).SetInteractionViewState(false);
            }
        }

        //check for win condition
        //check if each endzone stack is full
        let victory:Boolean = true;
        for (let i = 0; i < 4; i++) 
        {
            if(this.GetCollection(2,i).cardList.size() < 13)
            {
                victory = false;
            }
        }
        if(victory)
        {
            this.textGameState.value = "Victory!";
            return;
        }

        //if no card is selected
        if(this.cardCurrentHouse == -1)
        {
            //top card in endzone/deck/discard tiles are valid
            //  process each stack group
            for (let i = 0; i < this.cardStacks.size(); i++) 
            {
                //get card from top of stack
                collection = this.cardStacks.getItem(i);
                card = collection.cardList.getItem(collection.cardList.size()-1);
                //endzones stack
                if(i < 4)
                {
                    //ensure group has a card available
                    if(collection.cardList.size() > 0)
                    {
                        //update card object interactions
                        this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionState(true);
                        this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionViewState(true);
                    }
                }
                //deck stack
                else if(i == 4)
                {
                    //ensure cards still remain in deck
                    if(collection.cardList.size() > 0)
                    {
                        this.GetGroupObject(2, i).SetInteractionState(true);
                        this.GetGroupObject(2, i).SetInteractionViewState(true);
                    }
                }
                //discard stack
                else
                {
                    //ensure group has a card available
                    if(collection.cardList.size() > 0)
                    {
                        //update card object interactions
                        this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionState(true);
                        this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionViewState(true);
                    }
                }
            }
            //  process each slide group
            for (let i = 0; i < this.cardSlides.size(); i++) 
            {
                //ensure group has a card available
                collection = this.cardSlides.getItem(i);
                if(collection.cardList.size() > 0)
                {
                    //always allow top card movement
                    //  get card
                    card = collection.cardList.getItem(collection.cardList.size()-1);
                    //  update card object interactions
                    this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionState(true);
                    this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionViewState(true);

                    //conduct depth check for multi move
                    let cardPrev:Card;
                    for (let i = 1; i < collection.cardList.size(); i++) 
                    {
                        //get next card
                        card = collection.cardList.getItem(collection.cardList.size()-1-i);
                        cardPrev = collection.cardList.getItem(collection.cardList.size()-i);
                        //check for valid procession of face-up cards
                        if(Card.HOUSE_COLOUR[card.House] != Card.HOUSE_COLOUR[cardPrev.House] && (cardPrev.Value+1) == card.Value && this.GetCardObject(0, card.House, card.Value).faceState)
                        {
                            //update card object interactions
                            this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionState(true);
                            this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionViewState(true);

                        }
                        else 
                        {
                            break;
                        }
                    }

                }
            }
        }
        //if card is selected
        else
        {
            //selected card's deselect option
            this.GetCardObject(this.cardCurrentDeck, this.cardCurrentHouse, this.cardCurrentValue).SetInteractionState(true);
            this.GetCardObject(this.cardCurrentDeck, this.cardCurrentHouse, this.cardCurrentValue).SetInteractionViewState(true);

            //only enable endzone checks if a SINGLE card is selected
            if(this.GetCurrentCardData().groupPosition == this.GetCurrentCardCollection().cardList.size()-1)
            {
                //check endzones for valid placement
                for (let i = 0; i < 4; i++) 
                {
                    //endzone contains no cards, check current card for ace
                    collection = this.cardStacks.getItem(i);
                    if(collection.cardList.size() == 0)
                    {
                        if(this.cardCurrentValue == 0)
                        {
                            //update group object interactions
                            this.GetGroupObject(2, i).SetInteractionState(true);
                            this.GetGroupObject(2, i).SetInteractionViewState(true);
                        }
                    }
                    //endzone contains cards, check for house and value sequence
                    else
                    {
                        card = collection.cardList.getItem(collection.cardList.size()-1);
                        if(this.cardCurrentHouse == card.House && (this.cardCurrentValue-1) == card.Value)
                        {
                            //update group object interactions
                            this.GetGroupObject(2, i).SetInteractionState(true);
                            this.GetGroupObject(2, i).SetInteractionViewState(true);
                        }
                    }
                }
            }
            //check playzone for valid placement
            for (let i = 0; i < this.cardSlides.size(); i++) 
            {
                //playzone contains no cards, allow movement
                collection = this.cardSlides.getItem(i);
                if(collection.cardList.size() == 0)
                {
                    //update group object interactions
                    this.GetGroupObject(3, i).SetInteractionState(true);
                    this.GetGroupObject(3, i).SetInteractionViewState(true);
                }
                //playzone contains cards, check for house and value sequence
                else
                {
                    card = collection.cardList.getItem(collection.cardList.size()-1);
                    if(Card.HOUSE_COLOUR[this.cardCurrentHouse] != Card.HOUSE_COLOUR[card.House] && (this.cardCurrentValue+1) == card.Value)
                    {
                        //update card object interactions
                        this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionState(true);
                        this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionViewState(true);
                    }
                }
            }
        }
        if(this.isDebugging) { log("solitaire manager - displayed all possible selections"); }
    }

    //selects the given group
    //  this function handles game rules for what happens when the player clicks on a card group
    public SelectGroup(type:number, index:number)
    {
        if(this.isDebugging) { log("solitaire manager - selecting group "+CardCollection.STRINGS_TYPES[type]+":"+index.toString()); }
        //check all stacks
        let cardTmp:Card;
        let collection:CardCollection;
        if(type == 2)
        {
            collection = this.GetCollection(type, index);
            //if group is endzone
            if(index < 4)
            {
                //grab collection of the current card
                let collectionPrev:CardCollection = this.GetCollection(this.GetCurrentCardData().groupType, this.GetCurrentCardData().groupIndex);

                //take in current card to position
                this.MoveCard(this.cardCurrentDeck, this.cardCurrentHouse, this.cardCurrentValue, type, index, false);
                this.DeselectCard();

                //if a card remains
                if(collectionPrev.cardList.size() > 0)
                {
                    //flip new top card upright
                    cardTmp = collectionPrev.cardList.getItem(collectionPrev.cardList.size()-1);
                    this.GetCardObject(cardTmp.Deck, cardTmp.House, cardTmp.Value).SetFaceState(true);
                }
                if(this.isDebugging) { log("solitaire manager - selected card has entered end zone"); }
            }
            //if group deck stack
            else if (index == 4)
            {
                //get top card from deck stack
                cardTmp = collection.cardList.getItem(collection.cardList.size()-1);

                //flip card upright
                this.GetCardObject(cardTmp.Deck, cardTmp.House, cardTmp.Value).SetFaceState(true);

                //move card to discard pile
                this.MoveCard(cardTmp.Deck, cardTmp.House, cardTmp.Value, 2, 5, false);
                if(this.isDebugging) { log("solitaire manager - card moved from deck to discard zone"); }
            }
            //if group is discard stack
            else if (index == 5)
            {
                //update identity
                cardTmp = this.GetCardFromCollection(type, index, collection.cardList.size());
                
                //select card
                this.cardCurrentDeck = cardTmp.Deck;
                this.cardCurrentHouse = cardTmp.House;
                this.cardCurrentValue = cardTmp.Value;

                //change interaction display state
                this.GetCardObject(this.cardCurrentDeck, this.cardCurrentHouse, this.cardCurrentValue).SetInteractionState(true);
                this.GetCardObject(this.cardCurrentDeck, this.cardCurrentHouse, this.cardCurrentValue).SetInteractionViewState(true);

                //change card object selection elevation
                this.ApplyCardSelection(this.cardCurrentDeck, this.cardCurrentHouse, this.cardCurrentValue, cardTmp.groupType, cardTmp.groupIndex, true);
                if(this.isDebugging) { log("solitaire manager - card selected from discard zone"); }
            }
        }
        //check all slides
        else
        {
            //preform movement based on depth
            //card = this.GetCardData(this.cardCurrentDeck, this.cardCurrentHouse, this.cardCurrentValue); //get card for targeted placement
            collection = this.GetCollection(this.GetCurrentCardData().groupType, this.GetCurrentCardData().groupIndex); //process collection of current group
            let tarPos:number = this.GetCurrentCardData().groupPosition;
            let checkVal:number = this.GetCurrentCardCollection().cardList.size(); //required b.c anchoring card get swapped during process
            if(this.isDebugging) { log("solitaire manager - depth move params:"+tarPos.toString()+", "+checkVal.toString()); }
            for (let i = this.GetCurrentCardData().groupPosition; i < checkVal; i++) 
            {
                //use the positional from the card, list indexing changes via fill on-removal
                cardTmp = collection.cardList.getItem(0);   //first card by default
                for (let j = 0; j < collection.cardList.size(); j++) 
                {
                    if(this.isDebugging) { log("solitaire manager - depth["+i.toString()+"] pos:"+collection.cardList.getItem(j).groupPosition.toString()); }

                    if(collection.cardList.getItem(j).groupPosition == i)
                    {
                        cardTmp = collection.cardList.getItem(j);
                        break;
                    } 
                }
                if(this.isDebugging) { log("solitaire manager - depth["+tarPos.toString()+"] move:"+Card.STRINGS_VALUES[cardTmp.Value]+" of "+Card.STRINGS_HOUSES[cardTmp.House]); }

                //move card
                this.MoveCard(cardTmp.Deck, cardTmp.House, cardTmp.Value, type, index, false);
            }
            //deselect current card
            this.DeselectCard();
        }
        //update display for all valid moves
        this.DisplayMoves();
        if(this.isDebugging) { log("solitaire manager - selected group "+CardCollection.STRINGS_TYPES[type]+":"+index.toString()); }
    }

    //selects the given card
    //  this function handles game rules for what happens when the player clicks on a card
    public SelectCard(deck:number, house:number, value:number)
    {
        if(this.isDebugging) { log("solitaire manager - selecting card "+deck.toString()+":"+Card.STRINGS_VALUES[value]+" of "+Card.STRINGS_HOUSES[house]); }
        
        //if no card is selected, select all cards under this card
        let card:Card;
        let cardTmp:Card;
        let collection:CardCollection;
        if(this.cardCurrentDeck == -1)
        {
            //update identity
            this.cardCurrentDeck = deck;
            this.cardCurrentHouse = house;
            this.cardCurrentValue = value;
            card = this.GetCardData(this.cardCurrentDeck, this.cardCurrentHouse, this.cardCurrentValue);
            collection = this.GetCollection(card.groupType, card.groupIndex);

            //preform selection based on depth
            for (let i = 0; i < collection.cardList.size(); i++) 
            {
                //get next card from collection end
                cardTmp = collection.cardList.getItem(collection.cardList.size()-1-i);

                //change interaction display state
                this.GetCardObject(cardTmp.Deck, cardTmp.House, cardTmp.Value).SetInteractionState(true);
                this.GetCardObject(cardTmp.Deck, cardTmp.House, cardTmp.Value).SetInteractionViewState(true);

                //change card object selection elevation
                this.ApplyCardSelection(cardTmp.Deck, cardTmp.House, cardTmp.Value, cardTmp.groupType, cardTmp.groupIndex, true);

                //processed targeted card
                if(collection.cardList.size()-i-1 == card.groupPosition) { break; }
            }
        }
        //if selecting currently selected card, deselect all selected cards
        else if(this.cardCurrentDeck == deck && this.cardCurrentHouse == house && this.cardCurrentValue == value)
        {
            //preform deselection based on depth
            card = this.GetCardData(this.cardCurrentDeck, this.cardCurrentHouse, this.cardCurrentValue);
            collection = this.GetCollection(card.groupType, card.groupIndex);
            for (let i = card.groupPosition; i < collection.cardList.size(); i++) 
            {
                //get next card
                cardTmp = collection.cardList.getItem(i);

                //change interaction display state
                this.GetCardObject(cardTmp.Deck, cardTmp.House, cardTmp.Value).SetInteractionState(false);
                this.GetCardObject(cardTmp.Deck, cardTmp.House, cardTmp.Value).SetInteractionViewState(false);

                //change card object selection elevation
                this.ApplyCardSelection(cardTmp.Deck, cardTmp.House, cardTmp.Value, cardTmp.groupType, cardTmp.groupIndex, false);
            }
            //remove card from selection
            this.DeselectCard();
        }
        //if selecting new card, push all selected cards to new location
        else
        {
            //grab collection of the current card
            let collectionPrev:CardCollection = this.GetCollection(this.GetCurrentCardData().groupType, this.GetCurrentCardData().groupIndex);
            //preform movement based on depth
            card = this.GetCardData(deck, house, value); //get card for targeted placement
            collection = this.GetCollection(this.GetCurrentCardData().groupType, this.GetCurrentCardData().groupIndex); //process collection of current group
            let tarPos:number = this.GetCurrentCardData().groupPosition;
            let checkVal:number = this.GetCurrentCardCollection().cardList.size(); //required b.c anchoring card get swapped during process
            let offset:number = 0;
            if(this.isDebugging) { log("solitaire manager - depth move params:"+tarPos.toString()+", "+checkVal.toString()); }
            for (let i = this.GetCurrentCardData().groupPosition; i < checkVal; i++) 
            {
                //use the positional from the card, list indexing changes via fill on-removal
                cardTmp = collection.cardList.getItem(0);   //first card by default
                for (let j = 0; j < collection.cardList.size(); j++) 
                {
                    if(this.isDebugging) { log("solitaire manager - depth["+i.toString()+"] pos:"+collection.cardList.getItem(j).groupPosition.toString()); }

                    if(collection.cardList.getItem(j).groupPosition == i)
                    {
                        cardTmp = collection.cardList.getItem(j);
                        break;
                    } 
                }
                if(this.isDebugging) { log("solitaire manager - depth["+i.toString()+"] move:"+Card.STRINGS_VALUES[cardTmp.Value]+" of "+Card.STRINGS_HOUSES[cardTmp.House]); }

                //move card
                this.MoveCard(cardTmp.Deck, cardTmp.House, cardTmp.Value, card.groupType, card.groupIndex, false);
            }
            //deselect current card
            this.DeselectCard();
            //if a card remains
            if(collectionPrev.cardList.size() > 0)
            {
                //flip new top card upright
                cardTmp = collectionPrev.cardList.getItem(collectionPrev.cardList.size()-1);
                this.GetCardObject(cardTmp.Deck, cardTmp.House, cardTmp.Value).SetFaceState(true);
            }
        }
        //update display for all valid moves
        this.DisplayMoves();
        if(this.isDebugging) { log("solitaire manager - selected card "+deck.toString()+":"+Card.STRINGS_VALUES[value]+" of "+Card.STRINGS_HOUSES[house]); }
    }

    //deselects the currently selected card
    public DeselectCard()
    {
        //change interaction display state
        this.GetCardObject(this.cardCurrentDeck, this.cardCurrentHouse, this.cardCurrentValue).SetInteractionState(false);
        this.GetCardObject(this.cardCurrentDeck, this.cardCurrentHouse, this.cardCurrentValue).SetInteractionViewState(false);

        //update identity
        this.cardCurrentDeck = -1;
        this.cardCurrentHouse = -1;
        this.cardCurrentValue = -1;
    }
}