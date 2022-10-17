/*      ACCORDION SOLITAIRE CARD GAME MANAGER
    represents the logic/game rules of the game of solitaire, accordion style. 
    this game must be hosted via the game table module.
*/
import { Card } from "src/card-game-core/card";
import { CardCollection } from "src/card-game-core/card-collection";
import { CardGameManager } from "src/card-game-core/card-game-manager";
import { CardGameResources } from "src/card-game-core/card-game-resources";
import { List } from "src/utilities/collections";
export class CardGameManagerSolitaireAccordion extends CardGameManager
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
        //set board's scale
        this.cardObjectManager.getComponent(Transform).scale = new Vector3(1, 1, 1);

        //create required collections
        //  1 card deck
        this.resources.SetRequiredCollections(0, 1);
        //  1 stacks: 1 endzones
        this.resources.SetRequiredCollections(2, 1, true);
        //      place endzone to top right
        this.cardObjectManager.SetGroupObjectPosition(2, 0, 0, new Vector3(1.55, 0.05, 1.5));
        this.cardObjectManager.SetGroupCardPosition(2, 0, 0, new Vector3(0, 0.01, 0));
        this.cardObjectManager.SetGroupCardPosition(2, 0, 1, new Vector3(0, 0.001, 0));
        //  5 slides: playing field snake
        this.resources.SetRequiredCollections(3, 5, false);
        //      horizontal row left to right
        this.cardObjectManager.SetGroupObjectPosition(3, 0, 0, new Vector3(-1.27, 0.05, 0.90));
        this.cardObjectManager.SetGroupCardPosition(3, 0, 0, new Vector3(0, 0.01, 0));
        this.cardObjectManager.SetGroupCardPosition(3, 0, 1, new Vector3(0.1675, 0.001, 0.0));
        //      bend stub
        this.cardObjectManager.SetGroupObjectPosition(3, 1, 0, new Vector3(1.60, 0.05, 0.45));
        this.cardObjectManager.SetGroupCardPosition(3, 1, 0, new Vector3(0, 0.01, 0.20));
        this.cardObjectManager.SetGroupCardPosition(3, 1, 1, new Vector3(0.0, 0.001, 0.-0.20));
        //      horizontal row right to left
        this.cardObjectManager.SetGroupObjectPosition(3, 2, 0, new Vector3(1.255, 0.05, 0.00));
        this.cardObjectManager.SetGroupCardPosition(3, 2, 0, new Vector3(0, 0.01, 0));
        this.cardObjectManager.SetGroupCardPosition(3, 2, 1, new Vector3(-0.1675, 0.001, 0.0));
        //      bend stub
        this.cardObjectManager.SetGroupObjectPosition(3, 3, 0, new Vector3(-1.60, 0.05, -0.45));
        this.cardObjectManager.SetGroupCardPosition(3, 3, 0, new Vector3(0, 0.01, 0.20));
        this.cardObjectManager.SetGroupCardPosition(3, 3, 1, new Vector3(0.0, 0.001, -0.20));
        //      horizontal row left to right
        this.cardObjectManager.SetGroupObjectPosition(3, 4, 0, new Vector3(-1.255, 0.05, -0.90));
        this.cardObjectManager.SetGroupCardPosition(3, 4, 0, new Vector3(0.0, 0.01, 0));
        this.cardObjectManager.SetGroupCardPosition(3, 4, 1, new Vector3(0.1675, 0.001, 0.0));
        
        //card group interactions are not used, so disable them all
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

        this.textGameState.value = "Initialized...";
        if(this.isDebugging) { log("solitaire manager - initialized"); }
    }

    //begins a new game, shuffling deck and placing cards
    //  Reset() should always be called first, as it holds the initialization request
    private slideCardCount:number[] = [16, 3, 16, 3, 14];
    public NewGame()
    {
        if(this.isDebugging) { log("solitaire manager - new game starting"); }
        this.textGameState.value = "Starting New Game...";
        //set defualt state
        this.Reset();

        //shuffle cards
        this.ShuffleCards();

        //place cards across standard playzones
        let card:Card;
        let count:number = 0;
        for (let i = 0; i < this.countSlide; i++) 
        {
            //add next amount of cards to current slide
            for (let j = 0; j < this.slideCardCount[i]; j++) 
            {
                //get next card from deck
                card = this.cardList.getItem(count);
                this.MoveCard(card.Deck, card.House, card.Value, 3, i);
                //all cards face up
                this.GetCardObject(card.Deck, card.House, card.Value).SetFaceState(true);
                //push next card
                count++;
            }
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

        //check for win condition
        //check if only one card remains in first slide
        let victory:Boolean = true;
        if(this.GetCollection(3,0).cardList.size() > 1)
        {
            victory = false;
        }
        if(victory)
        {
            this.textGameState.value = "Victory!";
            return;
        }

        //if no card is selected
        if(this.cardCurrentHouse == -1)
        {
            //every card within available slides is a potential target
            for (let i = 0; i < this.countSlide; i++) 
            {
                //process all cards in this slide
                collection = this.cardSlides.getItem(i);
                for (let j = 0; j < collection.cardList.size(); j++) 
                {
                    //get next card from deck
                    card = collection.cardList.getItem(j);
                    this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionState(true);
                    this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionViewState(true);
                }
            }
        }
        //if card is selected
        else
        {
            //clear all moves from active cards in playzone
            for (let i = 0; i < this.countSlide; i++) 
            {
                //process all cards in this slide
                collection = this.cardSlides.getItem(i);
                for (let j = 0; j < collection.cardList.size(); j++) 
                {
                    //get next card from deck
                    card = collection.cardList.getItem(j);
                    this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionState(false);
                    this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionViewState(false);
                }
            }

            //selected card's deselect option
            this.GetCardObject(this.cardCurrentDeck, this.cardCurrentHouse, this.cardCurrentValue).SetInteractionState(true);
            this.GetCardObject(this.cardCurrentDeck, this.cardCurrentHouse, this.cardCurrentValue).SetInteractionViewState(true);

            //check card 1 position ahead
            card = this.GetCardData(this.cardCurrentDeck, this.cardCurrentHouse, this.cardCurrentValue);
            let cardTmp:Card|undefined = undefined;
            collection = this.GetCollection(card.groupType, card.groupIndex);
            //get card (we can get through with a low check because we'll never need to check 2 slides behind)
            //  if next card is in current slide 
            if(card.groupPosition >= 1)
            {
                cardTmp = collection.cardList.getItem(card.groupPosition-1);
            }
            //  if next card is in prev slide and there is a group behind
            else if(card.groupIndex > 0)
            {
                //if a slide remains ahead
                let collectionTmp:CardCollection = this.GetCollection(card.groupType, card.groupIndex-1);
                cardTmp = collectionTmp.cardList.getItem(collectionTmp.cardList.size()+card.groupPosition-1);
                if(this.isDebugging) { log((card.groupIndex-1)+" "+(collectionTmp.cardList.size()-1+card.groupPosition-1)); }
            }
            //test card
            if(cardTmp != undefined)
            {
                //only cards of the same value or house can be consumed
                if(card.House == cardTmp.House || card.Value == cardTmp.Value)
                {
                    this.GetCardObject(cardTmp.Deck, cardTmp.House, cardTmp.Value).SetInteractionState(true);
                    this.GetCardObject(cardTmp.Deck, cardTmp.House, cardTmp.Value).SetInteractionViewState(true);
                }
            }
            
            //check card 3 positions ahead
            cardTmp = undefined;
            collection = this.GetCollection(card.groupType, card.groupIndex);
            //get card (we can get through with a low check because we'll never need to check 2 slides behind)
            //  if next card is in current slide 
            if(card.groupPosition >= 3)
            {
                cardTmp = collection.cardList.getItem(card.groupPosition-3);
            }
            //  if next card is in prev slide and there is a group behind
            else if(card.groupIndex > 0)
            {
                //if a slide remains ahead
                let collectionTmp:CardCollection = this.GetCollection(card.groupType, card.groupIndex-1);
                cardTmp = collectionTmp.cardList.getItem(collectionTmp.cardList.size()+card.groupPosition-3);
                if(this.isDebugging) { log((card.groupIndex-1)+" "+(collectionTmp.cardList.size()-1+card.groupPosition-3)); }
            }
            //test card
            if(cardTmp != undefined)
            {
                //only cards of the same value or house can be consumed
                if(card.House == cardTmp.House || card.Value == cardTmp.Value)
                {
                    this.GetCardObject(cardTmp.Deck, cardTmp.House, cardTmp.Value).SetInteractionState(true);
                    this.GetCardObject(cardTmp.Deck, cardTmp.House, cardTmp.Value).SetInteractionViewState(true);
                }
            }
        }
        if(this.isDebugging) { log("solitaire manager - displayed all possible selections"); }
    }

    //selects the given group
    //  this function handles game rules for what happens when the player clicks on a card group
    //  for this game mode there should be no reason to select a group
    public SelectGroup(type:number, index:number)
    {
        if(this.isDebugging) { log("solitaire manager - selecting group "+CardCollection.STRINGS_TYPES[type]+":"+index.toString()); }
        
        if(this.isDebugging) { log("solitaire manager - selected group "+CardCollection.STRINGS_TYPES[type]+":"+index.toString()); }
    }

    //selects the given card
    //  this function handles game rules for what happens when the player clicks on a card
    public SelectCard(deck:number, house:number, value:number)
    {
        if(this.isDebugging) { log("solitaire manager - selecting card "+deck.toString()+":"+Card.STRINGS_VALUES[value]+" of "+Card.STRINGS_HOUSES[house]); }
        
        //if no card is selected, select card
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

            //change interaction display state
            this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionState(true);
            this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionViewState(true);

            //change card object selection elevation
            this.ApplyCardSelection(card.Deck, card.House, card.Value, card.groupType, card.groupIndex, true);
        }
        //if selecting currently selected card, deselect card
        else if(this.cardCurrentDeck == deck && this.cardCurrentHouse == house && this.cardCurrentValue == value)
        {
            //preform deselection based on depth
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
        //if selecting new card, remove targeted card and put selected card into position
        else
        {
            //preform movement based on depth
            card = this.GetCardData(this.cardCurrentDeck, this.cardCurrentHouse, this.cardCurrentValue);
            cardTmp = this.GetCardData(deck, house, value);
            collection = this.GetCollection(card.groupType, card.groupIndex);
            let collectionTmp:CardCollection = this.GetCollection(cardTmp.groupType, cardTmp.groupIndex);

            //store positional data from targeted card 
            let pos:number = cardTmp.groupPosition;
            let slide:number = cardTmp.groupIndex;

            //remove current card from collection
            collection.RemoveCard(card);
            //force current card into target card's position 
            collectionTmp.SwapCard(card, cardTmp);
            //move targeted card to the discard pile
            this.MoveCard(cardTmp.Deck, cardTmp.House, cardTmp.Value, 2, 0, false);
        
            //change interaction display state
            this.GetCardObject(cardTmp.Deck, cardTmp.House, cardTmp.Value).SetInteractionState(false);
            this.GetCardObject(cardTmp.Deck, cardTmp.House, cardTmp.Value).SetInteractionViewState(false);

            //change card object selection elevation
            this.ApplyCardSelection(card.Deck, card.House, card.Value, card.groupType, card.groupIndex, false);
            
            //update position of all cards, pulling cards forward as needed
            let collectionNext:CardCollection|undefined;
            while(slide < this.countSlide)
            {   log("solitaire manager - processing slide: "+slide.toString());
                //get target collection
                collection = this.GetCollection(3, slide);

                //check for the next slide
                if((slide+1) < this.countSlide) collectionNext = this.cardSlides.getItem(this.countSlide+1);
                else collectionNext = undefined;

                //ensure this slide has the required amount of cards
                //  evens have 16, odds have 3
                let reqCards:number = 0;
                if(slide%2==0 && collection.cardList) reqCards = 16;
                else if(slide%2==1 && collection.cardList) reqCards = 3;
                if(collection.cardList.size() < reqCards && collectionNext != undefined)
                {
                    //check next collection for available card
                    if((slide+1) < this.countSlide && this.cardSlides.getItem(slide+1).cardList.size() > 0)
                    {
                        log("solitaire manager - next slide exists and a pull forward is required");
                        //move card to current slide
                        card = this.cardSlides.getItem(slide+1).cardList.getItem(0);
                        this.MoveCard(card.Deck, card.House, card.Value, 3, slide);
                    }
                }

                //process each card in slide, resetting data and position
                let tmpList = new List<Card>(); 
                while(collection.cardList.size() > 0)
                {
                    card = collection.cardList.getItem(collection.cardList.size()-1);
                    tmpList.addItem(card);
                    collection.RemoveCard(card);
                    log("solitaire manager - reaffixing card:"+Card.STRINGS_VALUES[card.Value]+" of "+Card.STRINGS_HOUSES[card.House]);
                }
                while(tmpList.size() > 0)
                {
                    card = tmpList.getItem(tmpList.size()-1);
                    this.MoveCard(card.Deck, card.House, card.Value, 3, slide);
                    tmpList.removeItem(card);
                }
                slide++;
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

/*LAMBDA EXAMPLE:
    this is included because accordion's turn processing uses a recursive lambda and I know these
    things can be rather confusing at times. with one of the focuses of this module being learning
    how to develop projects it seems only right that a breakdown of complex ideas should be made available
    to provide learning oppertunities.

    lambdas are nameless in-line functions that can be used to preform complex tasks without having to create
    a new function. for our use here, this lets us break down the complex task of moving every card in the
    accordion chain forward without having to expand our base class or delegation links. the implementation here
    is a simplification of how the chain edit works, it creates a lambda that recursively calls itself until the
    designated task is complete.

    now, we do have to be careful with these, because if we are completing highly complex tasks we can run into
    issues like blowing our stack or unending chains. luckily our card shift is only ever going to be hitting as
    many processes as there are cards in the deck, so in this case it works splendidly.
*/
/*
//define lambda that recursively adds x to y for given number of times (count)
let sum = (x:number, y:number, count:number):number => 
{
    log("count:"+count.toString()+", x=:"+x.toString()+" y="+y.toString())

    //reduce required addition count
    count--;
    
    //check if more additions are required
    if(count != 0) x += sum(x,y,count);
    
    //return end result
    return x+y;
}
log("result: "+sum(0,2,2).toString());
*/