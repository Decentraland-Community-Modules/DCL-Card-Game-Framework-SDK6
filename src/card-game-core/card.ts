/*      CARD DEFS
    defines the core attributes for cards, such as the card's owner deck, house, and number 
*/
export class Card 
{
    //strings for card lettered card description
    public static STRINGS_HOUSES:string[] = ["Spades", "Diamonds", "Clubs", "Hearts"];
    public static HOUSE_COLOUR:number[] = [0, 1, 0, 1];
    public static STRINGS_VALUES:string[] = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];
    public static STRING_STATE:string[] = ["Face-Up", "Face-Down"];
    //returns access key of requested card
    public static GetKey(cardDeck:number, cardHouse:number, cardValue:number) 
    { 
        return cardDeck.toString()+"_"+cardHouse.toString()+"_"+cardValue.toString(); 
    }

    //primary attributes for individual card
    //  these values cannot be changed by external factors
    private deck:number; public get Deck() { return this.deck; }
    private house:number; public get House() { return this.house; }
    private value:number; public get Value() { return this.value; }
    //provides a string representing the access key of this card
    public get Key()
    {
        return this.Deck.toString() + "_" + this.house + "_" + this.value;
    }

    //identity of group this card belongs to
    //  type = 0 -> initialized but not part of any group yet
    //  type = -1 -> recently removed from group, likely hidden from play
    public groupType:number;
    public groupIndex:number;
    public groupPosition:number;    //position in the group (from start and zero indexed)


    //represents the current visibility state
    private state:boolean; get State() { return this.state; }
    
    //constructor
    constructor(deck:number, house:number, value:number) 
    {
        //set card definition
        this.deck = deck;
        this.house = house;
        this.value = value;

        //default group into null group
        this.groupType = -1;
        this.groupIndex = -1;
        this.groupPosition = -1;

        //default state to face down
        this.state = false;
    }
}