/*      FREECELL SOLITAIRE CARD GAME MANAGER
    represents the logic/game rules of the game of solitaire, freecell style. 
    this game must be hosted via the game table module. 
*/
//import { Card } from "src/card-game-core/card";
//import { CardCollection } from "src/card-game-core/card-collection";
import { Card } from "src/card-game-core/card";
import { CardCollection } from "src/card-game-core/card-collection";
import { CardGameManager } from "src/card-game-core/card-game-manager";
export class CardGameManagerSolitaireFreeCell extends CardGameManager
{
    //number of free zones available for use when moving large stacks
    //  free cells 
    availableFreeZones:number = 0;
    //  playzone cells
    availablePlayzones:number = 0;

    //display text used for displaying current game state
    //  'in-progress/win/loss' should only be seen, but also provides some debugging info if crashes at certain state
    textGameState:TextShape;

    //constructor
    constructor(parent:Entity, textGameState:TextShape)
    {
        //base constructor
        super(parent);
        this.gameName = "FreeCell";
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
            this.cardObjectManager.SetGroupObjectPosition(2, i, 0, new Vector3(1.52-(i*0.36), 0.05, 1.45));
            this.cardObjectManager.SetGroupCardPosition(2, i, 0, new Vector3(0, 0.01, 0));
            this.cardObjectManager.SetGroupCardPosition(2, i, 1, new Vector3(0, 0.001, 0));
            //set restriction details
            //  change visibility
            this.GetCollection(2, i).visibilityType = 1;
            //  only allow a single house in straight order
            this.GetCollection(2, i).placementTypePrimary = 1;
            this.GetCollection(2, i).placementTypeSecondary = i;
       }
        //  create 4 stacks for free cells, each only accepts 1 card of any type
        for (let i = 0; i < 4; i++) 
        {
            //create collection
            this.AddCollection(2, i+4);
            //set object position details
            this.cardObjectManager.SetGroupObjectPosition(2, i+4, 0, new Vector3(-1.52+(i*0.36), 0.05, 1.45));
            this.cardObjectManager.SetGroupCardPosition(2, i+4, 0, new Vector3(0, 0.01, 0));
            this.cardObjectManager.SetGroupCardPosition(2, i+4, 1, new Vector3(0, 0.001, 0));
            //set restriction details
            //  change card limit
            this.GetCollection(2, i).cardMaxCount = 1;
            //  change visibility
            this.GetCollection(2, i).visibilityType = 1;
            //  only allow a single house in straight order
            this.GetCollection(2, i).placementTypePrimary = 0;
            this.GetCollection(2, i).placementTypeSecondary = 0;
        }
        //  create 8 slides for playing field
        for (let i = 0; i < 8; i++) 
        {
            //create collection
            this.AddCollection(3, i);
            //set object position details
            this.cardObjectManager.SetGroupObjectPosition(3, i, 0, new Vector3(-1.52+(i*0.435), 0.05, 0.90));
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

        //set available zone count to default
        this.availableFreeZones = 4;
        this.availablePlayzones = 0;

        //shuffle cards
        this.cardDecks.getItem(0).ShuffleCards();

        //sort all cards across all standard playzones
        let house:number;
        let value:number;
        if(this.isDebugging) { log("solitaire manager - deck size "+this.GetCollection(0,0).cardList.size().toString()); }
        for (let i = 0; i < this.GetCollection(0,0).cardList.size(); i++) 
        {
            house = this.GetCardFromCollection(0,0,i).House;
            value = this.GetCardFromCollection(0,0,i).Value;
            this.MoveCard
            (
                0,
                house,
                value,
                3,
                i%8
            );
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

        //revalue available free cells
        //  TODO: could optimize by altering value when cards are added/removed from freecells
        this.availableFreeZones = 0;
        for (let i = 0; i < 4; i++) 
        {
            if(this.GetCollection(2,i+4).cardList.size() == 0)
            {
                this.availableFreeZones++;
            }
        }

        //if no card is selected
        if(this.cardCurrentHouse == -1)
        {
            //top card in endzone/freecell tiles are valid
            //  process each stack group
            for (let i = 0; i < this.cardStacks.size(); i++) 
            {
                //ensure group has a card available
                collection = this.cardStacks.getItem(i);
                if(collection.cardList.size() > 0)
                {
                    //get card
                    card = collection.cardList.getItem(collection.cardList.size()-1);
                    //update card object interactions
                    this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionState(true);
                    this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionViewState(true);
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
                        //allowance is based on number of freezones available
                        if(i > this.availableFreeZones) { break; }

                        //get next card
                        card = collection.cardList.getItem(collection.cardList.size()-1-i);
                        cardPrev = collection.cardList.getItem(collection.cardList.size()-i);
                        //check for valid procession
                        if(Card.HOUSE_COLOUR[card.House] != Card.HOUSE_COLOUR[cardPrev.House] && (cardPrev.Value+1) == card.Value)
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

            //only enable freecell and endzone checks if a SINGLE card is selected
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
                //check freecells for valid placement
                for (let i = 4; i < 8; i++) 
                {
                    //endzone contains no cards, check current card for ace
                    collection = this.cardStacks.getItem(i);
                    if(collection.cardList.size() == 0)
                    {
                        //update group object interactions
                        this.GetGroupObject(2, i).SetInteractionState(true);
                        this.GetGroupObject(2, i).SetInteractionViewState(true);
                    }
                }
            }
            //check playzone for valid placement
            for (let i = 0; i < 8; i++) 
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
        let card:Card;
        let collection:CardCollection;
        if(type == 2)
        {
            //if group is endzone
            if(index < 4)
            {
                //take in current card to position
                this.MoveCard(this.cardCurrentDeck, this.cardCurrentHouse, this.cardCurrentValue, type, index, false);
                this.DeselectCard();
                if(this.isDebugging) { log("solitaire manager - selected card has entered end zone"); }
            }
            //if group is freezone
            else
            {
                //if no card is selected, select last card from group
                if(this.cardCurrentDeck == -1)
                {
                    //update identity
                    collection = this.GetCollection(type, index);
                    card = this.GetCardFromCollection(type, index, collection.cardList.size());
                    this.cardCurrentDeck = card.Deck;
                    this.cardCurrentHouse = card.House;
                    this.cardCurrentValue = card.Value;

                    //change interaction display state
                    this.GetCardObject(this.cardCurrentDeck, this.cardCurrentHouse, this.cardCurrentValue).SetInteractionState(true);
                    this.GetCardObject(this.cardCurrentDeck, this.cardCurrentHouse, this.cardCurrentValue).SetInteractionViewState(true);

                    //change card object selection elevation
                    this.ApplyCardSelection(this.cardCurrentDeck, this.cardCurrentHouse, this.cardCurrentValue, card.groupType, card.groupIndex, true);
                }
                //if card is selected
                else
                {
                    //take in current card to position
                    this.MoveCard(this.cardCurrentDeck, this.cardCurrentHouse, this.cardCurrentValue, type, index, false);
                    this.DeselectCard();
                }
                if(this.isDebugging) { log("solitaire manager - selected card has entered free zone"); }
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
                card = collection.cardList.getItem(0);   //first card by default
                for (let j = 0; j < collection.cardList.size(); j++) 
                {
                    if(this.isDebugging) { log("solitaire manager - depth["+i.toString()+"] pos:"+collection.cardList.getItem(j).groupPosition.toString()); }

                    if(collection.cardList.getItem(j).groupPosition == i)
                    {
                        card = collection.cardList.getItem(j);
                        break;
                    } 
                }
                if(this.isDebugging) { log("solitaire manager - depth["+tarPos.toString()+"] move:"+Card.STRINGS_VALUES[card.Value]+" of "+Card.STRINGS_HOUSES[card.House]); }

                //move card
                this.MoveCard(card.Deck, card.House, card.Value, type, index, false);
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