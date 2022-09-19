/*      CARD COLLECTION DEFS
    standard definition of card collections, such as hands, decks, and piles
    types define how the collection is used in game-play and viewed within the scene
    0: card deck: acts as a pool of cards within a game, spread across other collections
        when created, decks generate both data and in-scene objects for a full set of cards
    1: card hand: represents a group of cards belonging to a player 
    2: card stack: represents an ordered pile of cards, only the top card is accessable for play
    3: card slide: represents a slide of cards, spread out at a certain distance

    each of these classes also contain placement requirements
*/
import { Card } from "./card"
import { List, Dictionary } from "../utilities/collections";
export class CardCollection 
{
    private isDebugging:boolean = false;
    public static STRINGS_TYPES:string[] = ["Deck", "Hand", "Stack", "Slide"];
    //returns access key of requested card collection
    public static GetKey(type:number, index:number)
    {
        return type.toString()+"_"+index.toString();
    }
    
    //identity index of card collection
    index:number; get Index() { return this.index; }
    //type of card collection, this should be set in the constructor of extending classes
    type:number; get Type() { return this.type; }

    //provides a string representing the access key of this collection
    get Key() { return this.Type.toString() + "_" + this.Index.toString(); }

    //max number of cards allowed, -1 makes no limit
    cardMaxCount:number;
    //visibility setting acts differently based on they type of card collection
        //decks contain no display settings
        //hand settings
            //visibility settings
            //  0 -> all cards hidden
            //  1 -> cards hidden from other players
            //  2 -> all cards visible
        //stack settings
            //  0 -> top card hidden
            //  1 -> top card visible
        //slide settings
            //visibility settings
            //  0 -> all cards hidden
            //  1 -> top card visible
            //  2 -> all cards visible
    visibilityType:number;
    //how cards must be ordered for new cards to be added
        //order settings
        //  0 -> none
        //  1 -> same house
        //  2 -> same colour
        //  3 -> alternating colour (red->black->red)
    placementTypePrimary:number;     //which placement type is selected
    placementTypeSecondary:number;   //which house/colour will be allowed

    //collection of all cards within the collection
    cardList:List<Card>;
    cardDict:Dictionary<Card>;

    //constructor
    //  requires a unique index and type of collection
    constructor(type:number, index:number) 
    {
        //set entity
        this.index = index;
        this.type = type;
        //set initial amount of allowed cards to any amount
        this.cardMaxCount = -1;
        //set default identity details
        this.visibilityType = 0;
        this.placementTypePrimary = 0;
        this.placementTypeSecondary = 0;

        //initialize collections
        this.cardList = new List<Card>();
        this.cardDict = new Dictionary<Card>();
    }

    //returns true if collection contains the requested card
    //  or false if the collection does not
    public HasCard(key:string)
    {
        return this.cardDict.containsKey(key);
    }

    //returns the card of provided key
    public GetCard(key:string)
    {
        return this.cardDict.getItem(key);
    }

    //adds a card from collection
    public AddCard(card:Card)
    {
        //change card's group identity
        card.groupType = this.type;
        card.groupIndex = this.index;
        card.groupPosition = this.cardList.size();
        //add to collections
        this.cardList.addItem(card);
        this.cardDict.addItem(card.Key, card);
    }

    //removes a card from collection
    public RemoveCard(card:Card)
    {
        //change card's group identity
        card.groupType = -1;
        card.groupIndex = -1;
        card.groupPosition = -1;
        //remove from collections
        this.cardList.removeItem(card);
        this.cardDict.removeItem(card.Key);
    }

    //randomly rearrange the cards within this collection
    public ShuffleCards()
    {
        if(this.isDebugging) { log("card collection - "+CardCollection.STRINGS_TYPES[this.type]+":"+this.index+" cards shuffling"); }
        //shift cards in list by randomly removing and adding cards to the list
        let card:Card;
        let swap:number;
        let count = this.cardList.size();
        if(this.isDebugging) { log("card collection - size:"+count.toString()); }
        
        for (let i = 0; i < count; i++) 
        {
            //determine slot to be swapped
            swap = Math.floor(Math.random() * (count));

            if(this.isDebugging) { log("card collection - swap:"+swap.toString()); }
            //get current card from current slot
            card = this.cardList.getItem(i);
            //overwrite current slot with swap slot
            this.cardList.assignItem(i, this.cardList.getItem(swap));
            //place current card int swap slot
            this.cardList.assignItem(swap, card);
        }
        if(this.isDebugging) { log("card collection - "+CardCollection.STRINGS_TYPES[this.type]+":"+this.index+" cards shuffled"); }
    }
}