/*      CARD GAME RESOURCES
    used to manage overhead resources for card games. the main utility is maintaining 
    a single set of card data and objects used between multiple card games a single table.
    this massively reduces in-scene requirements, as each card game can just interact with this
    class to get their resources instead of generating their own.

    if a resource or data is a common requirement across multiple games, then is should be placed here. this
    includes references to menu state display, card objects, and card data. in-scene objects (such as
    groups and cards) should still be moved/have positioning maintained within card game manager class.

    NOTE: objects are not destroyed between games, but are removed from scene rendering. this cuts
    down on processing usage by always retaining generated decks at a slight hit to memory (which is
    currently worth it).
*/
import { Card } from "./card";
import { CardCollection } from "./card-collection";
import { List, Dictionary } from "../utilities/collections";
import { CardGameMovementSystem } from "./card-game-movement-system";
import { CardGroupObject, CardObject, CardObjectManager } from "./card-game-object";
export class CardGameResources
{
    isDebugging:boolean = true;

    //current card
    cardCurrentDeck:number = -1;
    cardCurrentHouse:number = -1;
    cardCurrentValue:number = -1;

    //number of collections required for this card game
    countDeck = -1;
    countHand = -1;
    countStack = -1;
    countSlide = -1;

    //data pieces
    //  all cards currently included in the game
    cardList:List<Card>;
    //  all card decks
    cardDecks:List<CardCollection>;
    //  all game collections
    cardHands:List<CardCollection>;
    cardStacks:List<CardCollection>;
    cardSlides:List<CardCollection>;
    //  dictionary access for all collections
    cardCollectionList:List<CardCollection>[];
    cardCollectionDict:Dictionary<CardCollection>;

    //connected menu pieces
    textGameState:TextShape;

    //scene objects
    cardObjectManager:CardObjectManager;

    //movement system
    movementSystem:CardGameMovementSystem;

    //delegates and fillers
    //fillers are the default function assigned to delegates, only providing interface debugging logs
    //these logs should never really appear organically during play, as delegates are assigned during game selection
    //  access current card's data
    public GetCurrentCardData:() => void;
    private getCurrentCardData() { log("resource manager - getting current card data"); }
    //  access current card's collection
    public GetCurrentCardCollection:() => void;
    private getCurrentCardCollection() { log("resource manager - getting current card collection"); }
    //  access requested collection
    public GetCollection:(type:number, index:number) => void;
    private getCollection(type:number, index:number) { log("resource manager - getting collection"); }
    //  access card at given index within requested collection
    public GetCardFromCollection:(collectionType:number, collectionIndex:number, positionIndex:number) => void;
    private getCardFromCollection(collectionType:number, collectionIndex:number, positionIndex:number) { log("resource manager - getting card from collection"); }
    //  move display
    public DisplayMoves:() => void;
    private displayMoves() { log("resource manager - displaying moves"); }
    //  card selection
    public SelectCard:(deck:number, house:number, value:number) => void;
    private selectCard(deck:number, house:number, value:number) { log("resource manager - selected card: deck="+deck.toString()+", house="+house.toString()+", value="+value.toString()); }
    //  group selection
    public SelectGroup:(type:number, index:number) => void;
    private selectGroup(type:number, index:number) { log("resource manager - selected group: type="+type.toString()+", ID="+index.toString()); }
    //  card data
    public GetCardData:(deck:number, house:number, value:number) => void;
    private getCardData(deck:number, house:number, value:number) { log("resource manager - getting card data: deck="+deck.toString()+", house="+house.toString()+", value="+value.toString()); }
    //  card object
    public GetCardObject:(deck:number, house:number, value:number) => void;
    private getCardObject(deck:number, house:number, value:number) { log("resource manager - getting card object: deck="+deck.toString()+", house="+house.toString()+", value="+value.toString()); }
    //  group object
    public GetGroupObject:(type:number, index:number) => void;
    private getGroupObject(type:number, index:number) { log("resource manager - getting group object: type="+type.toString()+", ID="+index.toString()); }
    //  move card
    public MoveCard:(deck:number, house:number, value:number, groupType:number, groupIndex:number, skipAnimation:boolean) => void;
    private moveCard(deck:number, house:number, value:number, groupType:number, groupIndex:number, skipAnimation:boolean = true) { log("resource manager - moving card: deck="+deck.toString()+", house="+house.toString()+", value="+value.toString()); }
    //  change card selection
    public ApplyCardSelection:(deck:number, cardHouse:number, value:number, groupType:number, groupIndex:number, state:boolean) => void;
    private applyCardSelection(deck:number, house:number, value:number, groupType:number, groupIndex:number, skipAnimation:boolean = true) { log("resource manager - changing select view on card: deck="+deck.toString()+", house="+house.toString()+", value="+value.toString()); }
    // deselect card
    public DeselectCard:() => void;
    private deselectCard() { log("resource manager - deselected card: deck="+this.cardCurrentDeck.toString()+", house="+this.cardCurrentHouse.toString()+", value="+this.cardCurrentValue.toString()); }

    //constructor
    constructor(parent:Entity, textGameState:TextShape)
    {
        if(this.isDebugging) { log("resource manager - initializing"); }
        //set game state display
        this.textGameState = textGameState;

        //initialize scene objects
        this.cardObjectManager = new CardObjectManager(parent);

        //movement system
        this.movementSystem = new CardGameMovementSystem();
        engine.addSystem(this.movementSystem);

        //initialize collections
        this.cardList = new List<Card>();
        this.cardDecks = new List<CardCollection>();
        this.cardHands = new List<CardCollection>();
        this.cardStacks = new List<CardCollection>();
        this.cardSlides = new List<CardCollection>();
        this.cardCollectionList = [this.cardDecks, this.cardHands, this.cardStacks, this.cardSlides];
        this.cardCollectionDict = new Dictionary<CardCollection>();
        
        //prime delegates with defaulters
        this.GetCurrentCardData = this.getCurrentCardData;
        this.GetCurrentCardCollection = this.getCurrentCardCollection;
        this.GetCollection = this.getCollection;
        this.GetCardFromCollection = this.getCardFromCollection;
        this.DisplayMoves = this.displayMoves;
        this.SelectCard = this.selectCard;
        this.SelectGroup = this.selectGroup;
        this.MoveCard = this.moveCard;
        this.GetCardData = this.getCardData;
        this.GetCardObject = this.getCardObject;
        this.GetGroupObject = this.getGroupObject;
        this.ApplyCardSelection = this.applyCardSelection;
        this.DeselectCard = this.deselectCard;

        if(this.isDebugging) { log("resource manager - initialized"); }
    }

    //sets engine state of general card game resources
    //  adds/removes all systems/entities from scene rendering
    public SetState(state:boolean)
    {
        //card/group entities
        this.cardObjectManager.SetState(state);
        //movement systems
        if(state) { engine.addSystem(this.movementSystem); }
        else { engine.removeSystem(this.movementSystem); }
    }

    //resets common components for game, such as common cards list
    public Reset()
    {
        if(this.isDebugging) { log("resource manager - resetting common resources (old size:"+this.cardList.size().toString()+")"); }
        //process all cards in common list
        let card:Card;
        for (let i = this.cardList.size()-1; i >= 0; i--) 
        {
            //get card
            card = this.cardList.getItem(i); 

            //remove from group
            if(card.groupType != -1 && card.groupType != 0)
            {
                this.cardCollectionDict.getItem(CardCollection.GetKey(card.groupType, card.groupIndex)).RemoveCard(card);
            }

            //disable card object
            this.cardObjectManager.SetCardObjectState(card.Deck, card.House, card.Value, false);

            //remove card from common list
            this.cardList.removeItem(this.cardList.getItem(i));
        }
        if(this.isDebugging) { log("resource manager - reset common resources (new size:"+this.cardList.size().toString()+")"); }
    }

    //modifies the number of collection types that will be made available to the scene, displaying their objects by default
    //  if the current contained size of collections is below the requested count, new data and objects will be generated
    //  it is assumed reset has been called and all objects have been removed from scene render
    public SetRequiredCollections(type:number, count:number, shown:boolean=true)
    {
        if(this.isDebugging) { log("resource manager - allocating "+count.toString()+" "+CardCollection.STRINGS_TYPES[type]); }

        //update required collection count
        switch(type)
        {
            case 0: this.countDeck = count; break;
            case 1: this.countHand = count; break;
            case 2: this.countStack = count; break;
            case 3: this.countSlide = count; break;
        }

        //process each type within requirements
        for (let i = 0; i < count; i++) 
        {
            //check if collection requires generation
            if(this.cardCollectionList[type].size() <= i)
            {
                //create a new collection of required type
                this.AddCollection(type, this.cardCollectionList[type].size());
            }
            //process overhead addition of a collection
            switch(type)
            {
                //deck
                case 0:
                    //process all cards in target deck
                    let card:Card;
                    for (let j = 0; j < this.cardDecks.getItem(i).cardList.size(); j++) 
                    {
                        card = this.cardDecks.getItem(i).cardList.getItem(j);
                        //push card into common list
                        this.cardList.addItem(card);
                        //activate card objects
                        this.cardObjectManager.SetCardObjectState(card.Deck, card.House, card.Value, true);
                    }
                break;
                //hand
                case 1:
                    if(shown) this.cardObjectManager.SetGroupObjectState(type, i, true);
                break;
                //stack
                case 2:
                    if(shown) this.cardObjectManager.SetGroupObjectState(type, i, true);
                break;
                //slide
                case 3:
                    if(shown) this.cardObjectManager.SetGroupObjectState(type, i, true);
                break;
            }
        }
        if(this.isDebugging) { log("resource manager - allocated "+count.toString()+" "+CardCollection.STRINGS_TYPES[type]); }
    }

    //adds a card collection of the given type
    public AddCollection(type:number, index:number)
    {
        if(this.isDebugging) { log("resource manager - adding new collection: "+CardCollection.STRINGS_TYPES[type]+" ("+index.toString()+")"); }
    
        //create collection
        let collectionData = new CardCollection(type, index);
        this.cardCollectionList[type].addItem(collectionData);
        this.cardCollectionDict.addItem(collectionData.Key, collectionData);

        //create game object
        let collectionObject = this.cardObjectManager.AddGroupObject(type, index);

        //specific processing for each collection type
        switch(type)
        {
            //deck
            case 0:
                //populate the deck with a card of every value from each house
                let card:Card;
                for (let i = 0; i < Card.STRINGS_HOUSES.length; i++) 
                {
                    for (let j = 0; j < Card.STRINGS_VALUES.length; j++) 
                    {
                        //create data and add to collections
                        card = new Card(collectionData.Index, i, j);
                        collectionData.AddCard(card);
                        this.cardList.addItem(card);
                        //create game object
                        let cardObject = this.cardObjectManager.AddCardObject(index, i, j);
                        //add selection action to card
                        cardObject.collisionObject.addComponent
                        (
                            //add click action listener
                            new OnPointerDown
                            (
                                (e) =>
                                {
                                    this.SelectCard(collectionData.Index, i, j);
                                },
                                {
                                    button: ActionButton.ANY,
                                    showFeedback: true,
                                    hoverText: "[E] SELECT CARD",
                                    distance: 8
                                }
                            )
                        );
                    }
                }
            break;
            //hand
            case 1:
                //add click action listener
                this.cardObjectManager.groupObjectDict.getItem(CardObjectManager.GetKey(type, index)).collisionObject.addComponent
                (
                    //add click action listener
                    new OnPointerDown
                    (
                        (e) =>
                        {
                            this.SelectGroup(type, index);
                        },
                        {
                            button: ActionButton.ANY,
                            showFeedback: true,
                            hoverText: "[E] SELECT GROUP",
                            distance: 8
                        }
                    )
                );
            break;
            //stack
            case 2:
                //add click action listener
                this.cardObjectManager.groupObjectDict.getItem(CardObjectManager.GetKey(type, index)).collisionObject.addComponent
                (
                    //add click action listener
                    new OnPointerDown
                    (
                        (e) =>
                        {
                            this.SelectGroup(type, index);
                        },
                        {
                            button: ActionButton.ANY,
                            showFeedback: true,
                            hoverText: "[E] SELECT GROUP",
                            distance: 8
                        }
                    )
                );
            break;
            //slide
            case 3:
                //add click action listener
                this.cardObjectManager.groupObjectDict.getItem(CardObjectManager.GetKey(type, index)).collisionObject.addComponent
                (
                    //add click action listener
                    new OnPointerDown
                    (
                        (e) =>
                        {
                            this.SelectGroup(type, index);
                        },
                        {
                            button: ActionButton.ANY,
                            showFeedback: true,
                            hoverText: "[E] SELECT GROUP",
                            distance: 8
                        }
                    )
                );
            break;
        }
        if(this.isDebugging) { log("resource manager - adding new collection: "+CardCollection.STRINGS_TYPES[type]+" ("+index.toString()+")"); }
    }
}