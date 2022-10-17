/*      SPIDER SOLITAIRE CARD GAME MANAGER
    represents the logic/game rules of the game of solitaire, spider style. 
    this game must be hosted via the game table module.
*/
import { Card } from "src/card-game-core/card";
import { CardCollection } from "src/card-game-core/card-collection";
import { CardGameManager } from "src/card-game-core/card-game-manager";
import { CardGameResources } from "src/card-game-core/card-game-resources";
export class CardGameManagerSolitaireSpider extends CardGameManager
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
        this.cardObjectManager.getComponent(Transform).scale = new Vector3(0.75, 0.75, 0.75);

        //create required collections
        //  2 card decks
        this.resources.SetRequiredCollections(0, 2);
        //  9 stacks: 8 endzones, 1 deck remains
        this.resources.SetRequiredCollections(2, 9);
        //      position endzones
        for (let i = 0; i < 8; i++) 
        {
            //set object position details
            this.cardObjectManager.SetGroupObjectPosition(2, i, 0, new Vector3(1.8-(i*0.4), 0.10, 1.75));
            this.cardObjectManager.SetGroupCardPosition(2, i, 0, new Vector3(0, 0.01, 0));
            this.cardObjectManager.SetGroupCardPosition(2, i, 1, new Vector3(0, 0.001, 0));
            //set restriction details
            //  change visibility
            this.GetCollection(2, i).visibilityType = 1;
            //  only allow a single house in straight order
            this.GetCollection(2, i).placementTypePrimary = 1;
            this.GetCollection(2, i).placementTypeSecondary = i;
        }
        //      position deck remains
        for (let i = 0; i < 1; i++) 
        {
            //set object position details
            this.cardObjectManager.SetGroupObjectPosition(2, i+8, 0, new Vector3(-1.8, 0.10, 1.75));
            this.cardObjectManager.SetGroupCardPosition(2, i+8, 0, new Vector3(0, 0.01, 0));
            this.cardObjectManager.SetGroupCardPosition(2, i+8, 1, new Vector3(0, 0.001, 0));
            //set restriction details
            //  change visibility
            this.GetCollection(2, i+8).visibilityType = 1;
            //  only allow a single house in straight order
            this.GetCollection(2, i+8).placementTypePrimary = 0;
            this.GetCollection(2, i+8).placementTypeSecondary = 0;
        }
        //  10 slides for playing fields
        this.resources.SetRequiredCollections(3, 10);
        for (let i = 0; i < 10; i++) 
        {
            //set object position details
            this.cardObjectManager.SetGroupObjectPosition(3, i, 0, new Vector3(-1.8+(i*0.4), 0.10, 0.90));
            this.cardObjectManager.SetGroupCardPosition(3, i, 0, new Vector3(0, 0.01, 0));
            this.cardObjectManager.SetGroupCardPosition(3, i, 1, new Vector3(0, 0.001, -0.15));
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
        let size:number = 0;
        if(this.isDebugging) { log("solitaire manager - number of cards used "+this.cardList.size().toString()); }
        for (let i = 0; i < this.countSlide; i++) 
        {
            //add next amount of cards to current slide
            if(i < 4) { size = 6; } else { size = 5; }
            for (let j = 0; j < size; j++) 
            {
                //get next card from deck
                card = this.cardList.getItem(count);
                this.MoveCard(card.Deck, card.House, card.Value, 3, i);
                //all cards hidden, except those at the end of the slide
                if(j == size-1) this.GetCardObject(card.Deck, card.House, card.Value).SetFaceState(true);
                else this.GetCardObject(card.Deck, card.House, card.Value).SetFaceState(false);
                //push next card
                count++;
            }
        }

        //push remaining cards into deck stack
        if(this.isDebugging) { log("solitaire manager - number of cards used "+count.toString()); }
        for (let i = count; i < this.cardList.size(); i++) 
        {
            //get next card from deck
            card = this.cardList.getItem(i);
            this.MoveCard(card.Deck, card.House, card.Value, 2, 8);
            //all cards hidden
            this.GetCardObject(card.Deck, card.House, card.Value).SetFaceState(false);
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
        for (let i = 0; i < this.countStack; i++) 
        {
            this.GetGroupObject(2, i).SetInteractionState(false);
            this.GetGroupObject(2, i).SetInteractionViewState(false);
        }
        for (let i = 0; i < this.countSlide; i++) 
        {
            this.GetGroupObject(3, i).SetInteractionState(false);
            this.GetGroupObject(3, i).SetInteractionViewState(false);
        }
        //  all cards
        for (let i = 0; i < this.cardList.size(); i++) 
        {
            card = this.cardList.getItem(i);
            this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionState(false);
            this.GetCardObject(card.Deck, card.House, card.Value).SetInteractionViewState(false);
        }

        //check for win condition
        //check for a full set (ace to king) of the same house for removal into endzone
        //  process each slide group
        for (let i = 0; i < this.countSlide; i++) 
        {
            //ensure group has a card available, dont bother with slides that cannot have a full set
            collection = this.cardSlides.getItem(i);
            let cardPrev:Card;
            let cardTmp:Card;
            let tarPos:number = 0;
            let setFull:boolean = false;
            if(collection.cardList.size() > 12)
            {
                //ensure first card is ace
                if(collection.cardList.getItem(collection.cardList.size()-1).Value != 0)
                {
                    break;
                }

                //conduct depth check for full set
                for (let d = 1; d < collection.cardList.size(); d++) 
                {
                    //get next card
                    card = collection.cardList.getItem(collection.cardList.size()-1-d); //card closer to base
                    cardPrev = collection.cardList.getItem(collection.cardList.size()-d); //card closer to slide top
                    //check for valid procession of face-up cards
                    if(this.GetCardObject(card.Deck, card.House, card.Value).faceState && card.House == cardPrev.House && (cardPrev.Value+1) == card.Value)
                    {
                        //if current card is king, then set is full
                        if(card.Value == 12)
                        {
                            setFull = true;
                            tarPos = card.groupPosition;
                        }
                        break;
                    }
                    else 
                    {
                        break;
                    }
                }
        
                //if set is found
                if(setFull)
                {
                    //get next available endzone
                    let endzonePos:number = 0;
                    for (let i = 0; i < 8; i++) 
                    {
                        //get next endzone
                        if(this.GetCollection(2,i).cardList.size() == 0)
                        {
                            break;
                        }
                        endzonePos++;
                    }

                    //move all cards in full set to target endzone
                    //  preform movement based on depth
                    let checkVal:number = this.GetCurrentCardCollection().cardList.size(); //required b.c anchoring card get swapped during process
                    if(this.isDebugging) { log("solitaire manager - moving full set, depth move params:"+tarPos.toString()+", "+checkVal.toString()); }
                    for (let i = this.GetCurrentCardData().groupPosition; i < checkVal; i++) 
                    {
                        //use the positional from the card, list indexing changes via fill on-removal
                        cardTmp = collection.cardList.getItem(0);   //first card by default
                        for (let j = 0; j < collection.cardList.size(); j++) 
                        {
                            if(this.isDebugging) { log("solitaire manager - moving full set, depth["+i.toString()+"] pos:"+collection.cardList.getItem(j).groupPosition.toString()); }

                            if(collection.cardList.getItem(j).groupPosition == i)
                            {
                                cardTmp = collection.cardList.getItem(j);
                                break;
                            } 
                        }
                        if(this.isDebugging) { log("solitaire manager - moving full set, depth["+tarPos.toString()+"] move:"+Card.STRINGS_VALUES[cardTmp.Value]+" of "+Card.STRINGS_HOUSES[cardTmp.House]); }

                        //move card
                        this.MoveCard(cardTmp.Deck, cardTmp.House, cardTmp.Value, 2, i, false);
                    }

                    //if a card remains
                    if(collection.cardList.size() > 0)
                    {
                        //flip new top card upright
                        cardTmp = collection.cardList.getItem(collection.cardList.size()-1);
                        this.GetCardObject(cardTmp.Deck, cardTmp.House, cardTmp.Value).SetFaceState(true);
                    }

                    //deselect current card
                    this.DeselectCard();

                    //if endzone was final, set victory
                    if(endzonePos == 7)
                    {
                        this.textGameState.value = "Victory!";
                        return;
                    }
                }
            }
        }

        //if no card is selected
        if(this.cardCurrentDeck == -1)
        {
            //endzone is not interactable
            //  process deck stack
            collection = this.cardStacks.getItem(8);
            if(collection.cardList.size() > 0)
            {
                this.GetGroupObject(2, 8).SetInteractionState(true);
                this.GetGroupObject(2, 8).SetInteractionViewState(true);
            }
            //  process each slide group
            for (let i = 0; i < this.countSlide; i++) 
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
                        card = collection.cardList.getItem(collection.cardList.size()-1-i); //card closer to base
                        cardPrev = collection.cardList.getItem(collection.cardList.size()-i); //card closer to slide top
                        //check for valid procession of face-up cards
                        if(this.GetCardObject(card.Deck, card.House, card.Value).faceState && card.House == cardPrev.House && (cardPrev.Value+1) == card.Value)
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

            //endzone is not interactable
            //check playzone for valid placement
            for (let i = 0; i < this.countSlide; i++) 
            {
                //playzone contains no cards, allow movement if current card is a king
                collection = this.cardSlides.getItem(i);
                if(collection.cardList.size() == 0)
                {
                    //update group object interactions
                    this.GetGroupObject(3, i).SetInteractionState(true);
                    this.GetGroupObject(3, i).SetInteractionViewState(true);
                }
                //playzone contains cards, check for value sequence
                else
                {
                    card = collection.cardList.getItem(collection.cardList.size()-1);
                    if((this.cardCurrentValue+1) == card.Value)
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
        let cardTmp:Card;
        let collection:CardCollection;
        //is stacks
        //  endzone is not interactable
        //  if selection is deck stack
        if(type == 2 && index == 8)
        {
            collection = this.GetCollection(type, index);
            //push a single card to each playzone slide from deck stack
            for (let i = 0; i < this.countSlide; i++) 
            {
                //get last card from deck and push it to the slide's top
                cardTmp = collection.cardList.getItem(collection.cardList.size()-1);
                this.MoveCard(cardTmp.Deck, cardTmp.House, cardTmp.Value, 3, i);
                this.GetCardObject(cardTmp.Deck, cardTmp.House, cardTmp.Value).SetFaceState(true);
            }
        }
        //is slide
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

            //if a card remains
            if(collection.cardList.size() > 0)
            {
                //flip new top card upright
                cardTmp = collection.cardList.getItem(collection.cardList.size()-1);
                this.GetCardObject(cardTmp.Deck, cardTmp.House, cardTmp.Value).SetFaceState(true);
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