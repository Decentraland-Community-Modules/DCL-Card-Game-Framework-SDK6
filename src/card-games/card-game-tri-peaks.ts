/*      TRI PEAKS SOLITAIRE CARD GAME MANAGER
    represents the logic/game rules of the game of solitaire, tri peaks style. 
    this game must be hosted via the game table module.
*/
import { Card } from "src/card-game-core/card";
import { CardCollection } from "src/card-game-core/card-collection";
import { CardGameManager } from "src/card-game-core/card-game-manager";
import { CardGameResources } from "src/card-game-core/card-game-resources";
export class CardGameManagerSolitaireTriPeaks extends CardGameManager
{
    //constructor
    constructor(res:CardGameResources)
    {
        //base constructor
        super(res);
    }

    //used to initialize the card game's required resources
    public Initialize()
    {
        if(this.isDebugging) { log("solitaire manager - initializing"); }
        this.textGameState.value = "Initializing...";

        //create required collections
        //  1 card deck
        this.resources.SetRequiredCollections(0, 1);
        //   stacks: 1 deck, 1 discard
        this.resources.SetRequiredCollections(2, 3, true);
        //  create 3 stacks for deck, discard, and endzone
        for (let i = 0; i < 2; i++) 
        {
            //set object position details
            this.cardObjectManager.SetGroupObjectPosition(2, i, 0, new Vector3(-1.36+(i*0.4525), 0.05, 1.45));
            this.cardObjectManager.SetGroupCardPosition(2, i, 0, new Vector3(0, 0.01, 0));
        }
        //      positioning is sperate for deck vs discard stacks
        this.cardObjectManager.SetGroupCardPosition(2, 0, 1, new Vector3(0, 0.0, 0));
        this.cardObjectManager.SetGroupCardPosition(2, 1, 1, new Vector3(0, 0.001, 0));
        //      endzone
        this.cardObjectManager.SetGroupObjectPosition(2, 2, 0, new Vector3(1.36, 0.05, 1.45));
        this.cardObjectManager.SetGroupCardPosition(2, 2, 0, new Vector3(0, 0.01, 0));
        this.cardObjectManager.SetGroupCardPosition(2, 2, 1, new Vector3(0, 0.001, 0));
        //  4 slides playing field
        this.resources.SetRequiredCollections(3, 4, false);
        for (let i = 0; i < 4; i++) 
        {
            //set object position details
            this.cardObjectManager.SetGroupObjectPosition(3, i, 0, new Vector3(-(1.05+((i*0.35)/2)), 0.05, 0.80-(i*0.4)));
            this.cardObjectManager.SetGroupCardPosition(3, i, 0, new Vector3(0, (0.001*i)+0.01, 0));
            this.cardObjectManager.SetGroupCardPosition(3, i, 1, new Vector3(0.35, 0.0, 0));
        }
        this.textGameState.value = "Initialized...";
        if(this.isDebugging) { log("solitaire manager - initialized"); }
    }

    //begins a new game, shuffling deck and placing cards
    //  Reset() should always be called first, as it holds the initialization request
    public NewGame()
    {
        if(this.isDebugging) { log("solitaire manager - new game starting"); }
        this.textGameState.value = "Starting New Game...";
        //set defualt state
        this.Reset();

        //shuffle cards
        this.ShuffleCards();

        //sort required cards across standard playzones
        let card:Card;
        let count:number = 0;
        let size:number = 6;
        if(this.isDebugging) { log("solitaire manager - cards included: "+this.cardList.size().toString()); }
        if(this.isDebugging) { log("solitaire manager - moving cards to slides..."); }
        for (let i = 0; i < this.countSlide; i++) 
        {
            //add next amount of cards to current slide
            size++;
            for (let j = 0; j < size; j++) 
            {
                card = this.cardList.getItem(count);
                this.MoveCard(card.Deck, card.House, card.Value, 3, i);
                //all cards face up
                this.GetCardObject(card.Deck, card.House, card.Value).SetFaceState(true);
                //push next card
                count++;
            }
            log("cards in slide: "+this.cardSlides.getItem(i).cardList.size());
        }

        //push remaining cards into deck stack
        if(this.isDebugging) { log("solitaire manager - moving cards to deck remains..."); }
        for (let i = count; i < this.cardList.size(); i++) 
        {
            //get next card from deck
            card = this.cardList.getItem(i);
            this.MoveCard(card.Deck, card.House, card.Value, 2, 0);
            //all cards hidden
            this.GetCardObject(card.Deck, card.House, card.Value).SetFaceState(false);
        }

        //remove cards from slides to create peaks
        count = this.cardSlides.getItem(0).cardList.size()-1;
        for (let i = count; i >= 0; i--) 
        {
            if(i != 0 && i != 3 && i != 6)
            {
                card = this.cardSlides.getItem(0).cardList.getItem(i);
                this.MoveCard(card.Deck, card.House, card.Value, 2, 0);
                this.GetCardObject(card.Deck, card.House, card.Value).SetFaceState(false);
            }
        }
        count = this.cardSlides.getItem(1).cardList.size()-1;
        for (let i = count; i >= 0; i--) 
        {
            if(i == 2 || i == 5)
            {
                card = this.cardSlides.getItem(1).cardList.getItem(i);
                this.MoveCard(card.Deck, card.House, card.Value, 2, 0);
                this.GetCardObject(card.Deck, card.House, card.Value).SetFaceState(false);
            }
        }

        //display all valid moves
        this.DisplayMoves();
        this.textGameState.value = "In Progress";

        if(this.isDebugging) { log("solitaire manager - new game started"); }
    }

    //creates a preview of all possible moves available with the currently selected card, highlighting all moves
    //  this function contains all rules regarding card placement on the table and checking victory conditions
    //  currently this function relies on the main system NOT automatically redrawing or updating card positions and data
    // when a card is removed from the collection. 
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
        //  cards still left in pyramid
        if(this.GetCollection(3,0).cardList.size() > 0) { victory = false; }
        //  cards still left in discard or deck
        if(this.GetCollection(2,0).cardList.size() > 0) { victory = false; }
        if(this.GetCollection(2,1).cardList.size() > 0) { victory = false; }
        if(victory)
        {
            this.textGameState.value = "Victory!";
            return;
        }

        //if no card is selected
        if(this.cardCurrentHouse == -1)
        {
            //deck stack is active if there are cards
            collection = this.cardStacks.getItem(0);
            if(collection.cardList.size() > 0)
            {
                this.GetGroupObject(2, 0).SetInteractionState(true);
                this.GetGroupObject(2, 0).SetInteractionViewState(true);
            }

            //top card in discard stack is active
            collection = this.cardStacks.getItem(1);
            card = collection.cardList.getItem(collection.cardList.size()-1);
            if(collection.cardList.size() > 0)
            {
                //update card object interactions
                this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionState(true);
                this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionViewState(true);
            }

            //any 'free' card in slide is selectable
            //  process each slide group
            let selectable:boolean;
            for (let slide = 0; slide < this.countSlide; slide++) 
            {
                if(this.isDebugging) { log("solitaire manager - checking slide: "+slide.toString()); }
                //ensure group has a card available
                collection = this.cardSlides.getItem(slide);
                if(collection.cardList.size() > 0)
                {
                    //process every card in current collection
                    for (let j = 0; j < collection.cardList.size(); j++) 
                    {
                        //  get card
                        card = collection.cardList.getItem(j);
                        selectable = true;

                        //check next collection
                        if((slide+1) < this.countSlide)
                        {
                            if(this.isDebugging) { log("solitaire manager - next slide confirmed"); }
                            //process collection, looking for blocker cards
                            let collectionTmp = this.cardSlides.getItem(slide+1);
                            for (let k = 0; k < collectionTmp.cardList.size(); k++) 
                            {
                                if(this.isDebugging) { log("solitaire manager - cardCur:"+card.groupPosition+", cardTar:"+collectionTmp.cardList.getItem(k).groupPosition); }
                                //if a blocker card is found 
                                if(card.groupPosition == collectionTmp.cardList.getItem(k).groupPosition || card.groupPosition+1 == collectionTmp.cardList.getItem(k).groupPosition)
                                {
                                    selectable = false;
                                    break;
                                }
                            }
                        }

                        //update card object interactions
                        if(selectable)
                        {
                            this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionState(true);
                            this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionViewState(true);
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

            //check top card in discard pile
            collection = this.cardStacks.getItem(1);
            card = collection.cardList.getItem(collection.cardList.size()-1);
            if(collection.cardList.size() > 0 && this.cardCurrentValue + card.Value == 11)
            {
                //update card object interactions
                this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionState(true);
                this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionViewState(true);
            }

            //check playzone for valid selectionlet selectable:boolean;
            let selectable:boolean;
            for (let slide = 0; slide < this.countSlide; slide++) 
            {
                //ensure group has a card available
                collection = this.cardSlides.getItem(slide);
                if(collection.cardList.size() > 0)
                {
                    //process every card in current collection
                    for (let j = 0; j < collection.cardList.size(); j++) 
                    {
                        //  get card
                        card = collection.cardList.getItem(j);
                        //ensure card is of correct value
                        if(this.cardCurrentValue + card.Value != 11)
                        {
                            continue;
                        }
                        selectable = true;

                        //check next collection
                        if((slide+1) < this.countSlide)
                        {
                            //process collection, looking for blocker cards
                            let collectionTmp = this.cardSlides.getItem(slide+1);
                            for (let k = 0; k < collectionTmp.cardList.size(); k++) 
                            {
                                if(this.isDebugging) { log("solitaire manager - cardCur:"+card.groupPosition+", cardTar:"+collectionTmp.cardList.getItem(k).groupPosition); }
                                //if a blocker card is found 
                                if(card.groupPosition == collectionTmp.cardList.getItem(k).groupPosition || card.groupPosition+1 == collectionTmp.cardList.getItem(k).groupPosition)
                                {
                                    selectable = false;
                                    break;
                                }
                            }
                        }

                        //update card object interactions
                        if(selectable)
                        {
                            this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionState(true);
                            this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionViewState(true);
                        }
                    }
                }
            }
        }
        if(this.isDebugging) { log("solitaire manager - displayed all possible selections"); }
    }

    //selects the given group
    //  this function handles game rules for what happens when the player clicks on a card group
    //  groups selected during this game will only ever be deck remains or discard stacks 
    public SelectGroup(type:number, index:number)
    {
        if(this.isDebugging) { log("solitaire manager - selecting group "+CardCollection.STRINGS_TYPES[type]+":"+index.toString()); }

        let cardTmp:Card;
        let collection:CardCollection;
        collection = this.GetCollection(type, index);
        //if group deck stack
        if (index == 0)
        {
            //get top card from deck stack
            cardTmp = collection.cardList.getItem(collection.cardList.size()-1);

            //flip card upright
            this.GetCardObject(cardTmp.Deck, cardTmp.House, cardTmp.Value).SetFaceState(true);

            //move card to discard pile
            this.MoveCard(cardTmp.Deck, cardTmp.House, cardTmp.Value, 2, 1, false);
            if(this.isDebugging) { log("solitaire manager - card moved from deck to discard zone"); }
        }
        //if group is discard stack
        else if (index == 1)
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

        //update display for all valid moves
        this.DisplayMoves();
        if(this.isDebugging) { log("solitaire manager - selected group "+CardCollection.STRINGS_TYPES[type]+":"+index.toString()); }
    }

    //selects the given card
    //  this function handles game rules for what happens when the player clicks on a card
    public SelectCard(deck:number, house:number, value:number)
    {
        if(this.isDebugging) { log("solitaire manager - selecting card "+deck.toString()+":"+Card.STRINGS_VALUES[value]+" of "+Card.STRINGS_HOUSES[house]); }
        
        let card:Card;
        let cardTmp:Card;
        let collection:CardCollection;
        //if no card is selected, select card
        if(this.cardCurrentDeck == -1)
        {
            //if card is a king, throw it to the discard pile
            if(value == 12)
            {
                this.MoveCard(deck, house, value, 2, 2, false);
            }
            else
            {
                //update identity
                this.cardCurrentDeck = deck;
                this.cardCurrentHouse = house;
                this.cardCurrentValue = value;
                card = this.GetCardData(this.cardCurrentDeck, this.cardCurrentHouse, this.cardCurrentValue);
                collection = this.GetCollection(card.groupType, card.groupIndex);

                //change interaction display state
                this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionState(true);
                this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionViewState(true);

                //change card object selection elevation
                this.ApplyCardSelection(card.Deck, card.House, card.Value, card.groupType, card.groupIndex, true);
            }
        }
        //if selecting currently selected card, deselect selected card
        else if(this.cardCurrentDeck == deck && this.cardCurrentHouse == house && this.cardCurrentValue == value)
        {
            //update identity
            this.cardCurrentDeck = deck;
            this.cardCurrentHouse = house;
            this.cardCurrentValue = value;
            card = this.GetCardData(this.cardCurrentDeck, this.cardCurrentHouse, this.cardCurrentValue);
            collection = this.GetCollection(card.groupType, card.groupIndex);

            //change interaction display state
            this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionState(false);
            this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionViewState(false);

            //change card object selection elevation
            this.ApplyCardSelection(card.Deck, card.House, card.Value, card.groupType, card.groupIndex, false);
            //remove card from selection
            this.DeselectCard();
        }
        //if selecting new card, push current and selected card into discard pile
        else
        {
            this.MoveCard(this.cardCurrentDeck, this.cardCurrentHouse, this.cardCurrentValue, 2, 2, false);
            this.MoveCard(deck, house, value, 2, 2, false);
            
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