/*      CARD GAME MANAGER
        base class used to hold all data regarding a card game
    this class should be modified for each specific game, individually
    defining such thing as their player count and collections 

    TODO: create clean-up function to remove all entities and components
    from the scene, to be used when changing card games.
*/
import { Card } from "./card";
import { CardCollection } from "./card-collection";
import { CardGroupObject, CardObjectManager } from "./card-game-object";
import { List, Dictionary } from "../utilities/collections";
import { CardGameMovementSystem } from "./card-game-movement-system";
export class CardGameManager
{
    isDebugging:boolean = false;
    gameName:string = "";
    //game's current state
    //  0 -> reset
    //  1 -> in-session
    //  2 -> ended
    gameState:number;

    //number of players
    playerCount:number;
    //current player's turn it is
    playerCurrent:number;

    //currently selected card
    //  values are set at '-1' if no card is selected
    cardCurrentDeck:number;
    cardCurrentHouse:number;
    cardCurrentValue:number;
    public GetCurrentCardCollection()
    {
        return this.GetCollection(this.GetCurrentCardData().groupType, this.GetCurrentCardData().groupIndex);
    }
    public GetCurrentCardData()
    {
        return this.GetCollection(0, this.cardCurrentDeck).GetCard(Card.GetKey(this.cardCurrentDeck, this.cardCurrentHouse, this.cardCurrentValue));
    }

    //data pieces
    //  all cards pools
    cardDecks:List<CardCollection>;
    //  all game collections
    cardHands:List<CardCollection>;
    cardStacks:List<CardCollection>;
    cardSlides:List<CardCollection>;
    //  dictionary access for all collections
    cardCollectionList:List<CardCollection>[];
    cardCollectionDict:Dictionary<CardCollection>;
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

    //scene objects
    cardObjectManager:CardObjectManager;

    //movement system
    movementSystem:CardGameMovementSystem;

    //constructor
    //  this is only the default setup and should be modified when
    //  expanded into a specific game
    constructor(parent:Entity)
    {
        //movement system
        this.movementSystem = new CardGameMovementSystem();
        engine.addSystem(this.movementSystem);

        if(this.isDebugging) { log("card game manager - initializing"); }
        this.gameState = 0;

        this.playerCount = 0;
        this.playerCurrent = 0;

        this.cardCurrentDeck = -1;
        this.cardCurrentHouse = -1;
        this.cardCurrentValue = -1;

        //initialize collections
        this.cardDecks = new List<CardCollection>();
        this.cardHands = new List<CardCollection>();
        this.cardStacks = new List<CardCollection>();
        this.cardSlides = new List<CardCollection>();
        this.cardCollectionList = [this.cardDecks, this.cardHands, this.cardStacks, this.cardSlides];
        this.cardCollectionDict = new Dictionary<CardCollection>();

        //initialize scene objects
        this.cardObjectManager = new CardObjectManager(parent);

        if(this.isDebugging) { log("card game manager - initialized"); }
    }

    //sets the state of the card game relevent to engine
    //  adds/removes all systems/entities from the game scene
    public SetState(state:boolean)
    {
        //card/group entities
        this.cardObjectManager.SetState(state);
        //movement systems
        if(state) { engine.addSystem(this.movementSystem); }
        else { engine.removeSystem(this.movementSystem); }
    }

    //adds a card collection of the given type
    public AddCollection(type:number, index:number)
    {
        if(this.isDebugging) { log("card game manager - creating collection "+CardCollection.STRINGS_TYPES[type].toString()+":"+index.toString()); }
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
                for (let i = 0; i < Card.STRINGS_HOUSES.length; i++) 
                {
                    for (let j = 0; j < Card.STRINGS_VALUES.length; j++) 
                    {
                        //create data
                        collectionData.AddCard(new Card(collectionData.Index, i, j));
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
    }

    //selects the given group
    //  mainly defined as linkage to on-click events in inheriting classes
    public SelectGroup(type:number, index:number)
    {
    
    }

    //selects the given card
    //  mainly defined as linkage to on-click events in inheriting classes
    public SelectCard(deck:number, house:number, value:number) 
    {

    }

    //returns targeted card data
    public GetCardData(cardDeck:number, cardHouse:number, cardValue:number)
    {
        return this.GetCollection(0, cardDeck).GetCard(Card.GetKey(cardDeck, cardHouse, cardValue));
    }

    //returns targeted card object
    public GetCardObject(cardDeck:number, cardHouse:number, cardValue:number)
    {
        return this.cardObjectManager.cardObjectDict.getItem(Card.GetKey(cardDeck, cardHouse, cardValue));
    }

    //returns targeted group object
    public GetGroupObject(type:number, index:number)
    {
        return this.cardObjectManager.groupObjectDict.getItem(CardCollection.GetKey(type, index));
    }

    //moves a targeted card to the targeted group 
    //TODO: migrate card over time to new position
    public MoveCard(cardDeck:number, cardHouse:number, cardValue:number, groupType:number, groupIndex:number, skipAnimation:boolean = true)
    {
        if(this.isDebugging) { log("card game manager - moving card"); }
        let card:Card = this.GetCardData(cardDeck, cardHouse, cardValue);

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
            this.GetCardObject(cardDeck, cardHouse, cardValue).getComponent(Transform).position = 
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
                this.GetCardObject(cardDeck, cardHouse, cardValue), 
                this.GetCardObject(cardDeck, cardHouse, cardValue).getComponent(Transform).position, 
                this.cardObjectManager.groupObjectDict.getItem(groupType+"_"+groupIndex).CardPosition(this.GetCollection(groupType,groupIndex).cardList.size()-1)
            );
        }
        //anchor rotation to default, this should be pushed into the movement command when we begin handling actual player hands
        this.GetCardObject(cardDeck, cardHouse, cardValue).getComponent(Transform).rotation = new Quaternion().setEuler(-90,180,0);
        if(this.isDebugging) { log("card game manager - moved card"); }
    }

    //changes the card's position based on if it is selected
    //  selection offsets can be defined within group objects
    public ApplyCardSelection(cardDeck:number, cardHouse:number, cardValue:number, groupType:number, groupIndex:number, state:boolean)
    {
        //set card to selected group position
        if(state)
        {
            this.GetCardObject(cardDeck, cardHouse, cardValue).getComponent(Transform).position = 
                this.cardObjectManager.groupObjectDict.getItem(groupType+"_"+groupIndex).CardSelectedPosition
                (
                    this.GetCollection(groupType,groupIndex).GetCard(Card.GetKey(cardDeck, cardHouse, cardValue)).groupPosition
                );
        }
        //set card to standard group position
        else
        {
            this.GetCardObject(cardDeck, cardHouse, cardValue).getComponent(Transform).position = 
                this.cardObjectManager.groupObjectDict.getItem(groupType+"_"+groupIndex).CardPosition
                (
                    this.GetCollection(groupType,groupIndex).GetCard(Card.GetKey(cardDeck, cardHouse, cardValue)).groupPosition
                );
        }
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
        //  iterate through all decks
        let list:List<Card>;
        let card:Card;
        for (let d = 0; d < this.cardDecks.size(); d++) 
        {
            //iterate through deck's cards
            list = this.cardDecks.getItem(d).cardList;
            for (let i = 0; i < list.size(); i++) 
            {
                card = list.getItem(i);
                //ensure we are not removing card from a null/deck group
                if(card.groupType != -1 && card.groupType != 0)
                {
                    this.GetCollection(card.groupType, card.groupIndex).RemoveCard(card);
                }
                //disable interaction, highlight view, and selection
                this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionState(false);
                this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionViewState(false);
            }
        }

        if(this.isDebugging) { log("card game manager - game reset"); }
    }
}