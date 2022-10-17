/*      CARD GAME MANAGER
        base class used to hold all data regarding a card game
    this class should be modified for each specific game, individually
    defining such thing as their player count and collections 
*/
import { Card } from "./card";
import { CardCollection } from "./card-collection";
import { List, Dictionary } from "../utilities/collections";
import { CardGameResources } from "./card-game-resources";
import { CardGameMovementSystem } from "./card-game-movement-system";
import { CardGroupObject, CardObjectManager } from "./card-game-object";
export class CardGameManager
{
    isDebugging:boolean = false;

    //game's current state (this will be used for multiplayer games)
    //  0 -> reset
    //  1 -> in-session
    //  2 -> ended
    gameState:number;

    //number of collections required for this card game
    get countDeck():number { return this.resources.countDeck };
    get countHand():number { return this.resources.countHand };
    get countStack():number { return this.resources.countStack };
    get countSlide():number { return this.resources.countSlide };

    //number of players
    playerCount:number;
    //current player's turn it is
    playerCurrent:number;

    //currently selected card
    //  values are set at '-1' if no card is selected
    get cardCurrentDeck():number { return this.resources.cardCurrentDeck; }
    set cardCurrentDeck(val:number) { this.resources.cardCurrentDeck = val; }
    get cardCurrentHouse():number { return this.resources.cardCurrentHouse; }
    set cardCurrentHouse(val:number) { this.resources.cardCurrentHouse = val; }
    get cardCurrentValue():number { return this.resources.cardCurrentValue; }
    set cardCurrentValue(val:number) { this.resources.cardCurrentValue = val; }
    public GetCurrentCardData()
    {
        return this.GetCollection(0, this.cardCurrentDeck).GetCard(Card.GetKey(this.cardCurrentDeck, this.cardCurrentHouse, this.cardCurrentValue));
    }
    public GetCurrentCardCollection()
    {
        return this.GetCollection(this.GetCurrentCardData().groupType, this.GetCurrentCardData().groupIndex);
    }

    //resource manager
    resources:CardGameResources;
    //data pieces
    //  all cards
    get cardList():List<Card> { return this.resources.cardList; }
    //  all cards pools
    get cardDecks():List<CardCollection> { return this.resources.cardDecks; }
    //  all game collections
    get cardHands():List<CardCollection> { return this.resources.cardHands; }
    get cardStacks():List<CardCollection> { return this.resources.cardStacks; }
    get cardSlides():List<CardCollection> { return this.resources.cardSlides; }
    //  dictionary access for all collections
    get cardCollectionList():List<CardCollection>[] { return this.resources.cardCollectionList; };;
    get cardCollectionDict():Dictionary<CardCollection> { return this.resources.cardCollectionDict; };;
    //returns a requested collection
    public GetCollection(type:number, index:number)
    {
        return this.cardCollectionDict.getItem(CardCollection.GetKey(type, index));
    }
    //returns the card at given position within the targeted collection
    //  this is useful when iterating through decks at the start/reset of a game
    public GetCardFromCollection(collectionType:number, collectionIndex:number, positionIndex:number)
    {
        return this.GetCollection(collectionType, collectionIndex).cardList.getItem(positionIndex);
    }

    //display text used for displaying current game state
    //  'in-progress/win/loss' should only be seen, but also provides some debugging info if crashes at certain state
    get textGameState():TextShape  { return this.resources.textGameState; }

    //scene objects
    get cardObjectManager():CardObjectManager  { return this.resources.cardObjectManager; };

    //movement system
    get movementSystem():CardGameMovementSystem  { return this.resources.movementSystem; };

    //constructor
    //  this is only the default setup and should be modified when
    //  expanded into a specific game
    constructor(res:CardGameResources)
    {
        if(this.isDebugging) { log("card game manager - constructing..."); }
        
        this.resources = res;
        this.gameState = 0;

        this.playerCount = 0;
        this.playerCurrent = 0;

        this.cardCurrentDeck = -1;
        this.cardCurrentHouse = -1;
        this.cardCurrentValue = -1;

        if(this.isDebugging) { log("card game manager - constructed"); }
    }

    //used to initialize the card game's required resources
    //  mainly defined as interface linkage to inheriting classes
    public Initialize()
    {
        if(this.isDebugging) { log("card game manager - DEAD CHECK"); }
    }

    //resets the game's state
    //  this is the standard implemenation, you can create a custom solution within your
    //  inheriting card game manager class if required
    public Reset()
    {
        if(this.isDebugging) { log("card game manager - game resetting"); }

        //set initial game variables
        this.playerCurrent = 0;

        //unselect current card
        this.cardCurrentDeck = -1;
        this.cardCurrentHouse = -1;
        this.cardCurrentValue = -1;

        //remove all cards from non-deck groups and ensure all cards are deselected
        //  iterates through the current common list of included cards
        let card:Card;
        for (let i = 0; i < this.cardList.size(); i++) 
        {
            card = this.cardList.getItem(i);
            //ensure we are not removing card from a null/deck group
            if(card.groupType != -1 && card.groupType != 0)
            {
                this.GetCollection(card.groupType, card.groupIndex).RemoveCard(card);
            }
            //disable interaction, highlight view, and selection
            this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionState(false);
            this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionViewState(false);
        }
        //do a quick pass over all remaining hands, stacks, and slides to catch any missed/hanging cards
        for (let i = 0; i < this.cardHands.size(); i++)
        {
            let col:CardCollection = this.cardHands.getItem(i);
            while(col.cardList.size() > 0)
            {
                col.RemoveCard(col.cardList.getItem(col.cardList.size()-1));
            }
        } 
        for (let i = 0; i < this.cardStacks.size(); i++)
        {
            let col:CardCollection = this.cardStacks.getItem(i);
            while(col.cardList.size() > 0)
            {
                col.RemoveCard(col.cardList.getItem(col.cardList.size()-1));
            }
        } 
        for (let i = 0; i < this.cardSlides.size(); i++)
        {
            let col:CardCollection = this.cardSlides.getItem(i);
            while(col.cardList.size() > 0)
            {
                col.RemoveCard(col.cardList.getItem(col.cardList.size()-1));
            }
        } 
        

        if(this.isDebugging) { log("card game manager - game reset"); }
    }

    //shuffles all cards in this game TOGETHER
    //most card games use a single deck, so you can shuffle and process on a collection level
    //use this function if the card game requires multiple decks in-play at the same time
    //be sure to iterate through 'cardList' instead of the individual deck collections
    public ShuffleCards()
    {
        let card:Card;
        let swap:number;
        let count = this.cardList.size();
        for (let i = 0; i < this.cardList.size(); i++) 
        {
            swap = Math.floor(Math.random() * (count));
            card = this.cardList.getItem(swap);
            this.cardList.removeItem(card);
            this.cardList.addItem(card);
        }
    }

    //starts a new game
    //  mainly defined as interface linkage to inheriting classes
    public NewGame() 
    {

    }

    //displays all cards play can interact with
    //  extend this in you inherit class if you have additional objects (ex:alternative table)
    public DisplayMoves()
    {

    }

    //sets engine state of all card game resources
    //  extend this in you inherit class if you have additional objects (ex:alternative table)
    public SetState(state:boolean)
    {
        this.resources.SetState(state);
    }

    //selects the given group
    //  mainly defined as interface linkage to inheriting classes
    public SelectGroup(type:number, index:number) 
    { 

    }

    //selects the given card
    //  mainly defined as interface linkage to inheriting classes
    public SelectCard(deck:number, house:number, value:number) 
    {  

    }

    //returns targeted card data
    public GetCardData(deck:number, house:number, value:number)
    {
        return this.GetCollection(0, deck).GetCard(Card.GetKey(deck, house, value));
    }

    //returns targeted card object
    public GetCardObject(deck:number, house:number, value:number)
    {
        return this.cardObjectManager.cardObjectDict.getItem(Card.GetKey(deck, house, value));
    }

    //returns targeted group object
    public GetGroupObject(type:number, index:number)
    {
        return this.cardObjectManager.groupObjectDict.getItem(CardCollection.GetKey(type, index));
    }

    //moves a targeted card to the targeted group
    public MoveCard(deck:number, house:number, value:number, groupType:number, groupIndex:number, skipAnimation:boolean = true)
    {
        if(this.isDebugging) { log("card game manager - moving card"); }
        let card:Card = this.GetCardData(deck, house, value);

        //set card's data
        //  if card's group is not set to default
        if(card.groupType != 0 && card.groupType != -1)
        {
            //remove card from group
            this.GetCollection(card.groupType,card.groupIndex).RemoveCard(card);
        }
        //  add card to group
        this.GetCollection(groupType,groupIndex).AddCard(card);
        
        //move card's object
        //  instant movement
        if(skipAnimation)
        {
            this.GetCardObject(deck, house, value).getComponent(Transform).position = 
                this.cardObjectManager.groupObjectDict.getItem(groupType+"_"+groupIndex).CardPosition
                (
                    this.GetCollection(groupType,groupIndex).cardList.size()-1
                );
        }
        //  real-time movement
        else
        {
            this.movementSystem.AddMovementCommand
            (
                this.GetCardObject(deck, house, value), 
                this.GetCardObject(deck, house, value).getComponent(Transform).position, 
                this.cardObjectManager.groupObjectDict.getItem(groupType+"_"+groupIndex).CardPosition(this.GetCollection(groupType,groupIndex).cardList.size()-1)
            );
        }
        //anchor rotation to default, this should be pushed into the movement command when we begin handling actual player hands
        this.GetCardObject(deck, house, value).getComponent(Transform).rotation = new Quaternion().setEuler(-90,180,0);
        if(this.isDebugging) { log("card game manager - moved card"); }
    }

    //changes the card's position based on if it is selected
    //  selection offsets can be defined within group objects
    public ApplyCardSelection(deck:number, house:number, value:number, groupType:number, groupIndex:number, state:boolean)
    {
        //set card to selected group position
        if(state)
        {
            this.GetCardObject(deck, house, value).getComponent(Transform).position = 
                this.cardObjectManager.groupObjectDict.getItem(groupType+"_"+groupIndex).CardSelectedPosition
                (
                    this.GetCollection(groupType,groupIndex).GetCard(Card.GetKey(deck, house, value)).groupPosition
                );
        }
        //set card to standard group position
        else
        {
            this.GetCardObject(deck, house, value).getComponent(Transform).position = 
                this.cardObjectManager.groupObjectDict.getItem(groupType+"_"+groupIndex).CardPosition
                (
                    this.GetCollection(groupType,groupIndex).GetCard(Card.GetKey(deck, house, value)).groupPosition
                );
        }
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