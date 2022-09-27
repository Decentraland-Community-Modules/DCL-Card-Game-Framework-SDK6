/*      CARD GAME OBJECT MANAGER
    used to store all objects locations of cards are fed in through the
    owning CardGameData. positioning for objects is based on settings within
    the collection.

    upon creation, each card object also generates a selection object for that
    card. these objects are the only means which players can use to interact with
    cards (ie selecting a card for play) and should be managed within your card game
    manager. when selection objects are inactive they are removed from the engine, but
    still retained in data which might cause some bloat down the line. this system might
    have to be changed to an object pooling system down the line (after more testing).
*/
import { Card } from "./card";
import { List, Dictionary } from "../utilities/collections";
export class CardObjectManager extends Entity
{
    isDebugging:boolean = false;
    //table this manager is linked to
    table:Entity;

    //texture paths/materials used by system to display cards
    public static objectSetTag:String = "debuggingSet";
    public static objectModelPaths:string[] = 
    [
        "outline-hand.glb",
        "outline-stack.glb",
        "outline-slide.glb"
    ];
    //used textures and materials for card display
    public static cardTexture:Texture;
    public static cardMaterial:BasicMaterial;
    public static cardInteractionMaterialSelected:Material;
    public static cardInteractionMaterialInvisible:Material;

    //returns group key
    public static GetKey(type:number, index:number) { return type.toString()+"_"+index.toString(); }

    //grouping objects (hand, stack, slide)
    groupObjectList:List<CardGroupObject>;
    groupObjectDict:Dictionary<CardGroupObject>;

    //object collections for all cards in the game
    cardObjectList:List<CardObject>;
    cardObjectDict:Dictionary<CardObject>;

    //constructor
    constructor(parent:Entity)
    {
        super();
        this.table = parent;

        //if static material components have not yet been initialized
        if(CardObjectManager.cardTexture == undefined || CardObjectManager.cardTexture == null)
        {
            //create card texture/material
            CardObjectManager.cardTexture = new Texture("materials/cardgame-core/AllCardSlide.png", { wrap: 1, samplingMode: 0});
            CardObjectManager.cardMaterial = new BasicMaterial();
            CardObjectManager.cardMaterial.texture = CardObjectManager.cardTexture;
            //create card interaction materials
            //  card selected
            CardObjectManager.cardInteractionMaterialSelected = new Material();
            CardObjectManager.cardInteractionMaterialSelected.albedoColor = new Color4(1.0, 1.0, 0.0, 0.25);
            //  invisible
            CardObjectManager.cardInteractionMaterialInvisible = new Material();
            CardObjectManager.cardInteractionMaterialInvisible.albedoColor = new Color4(0.0, 0.0, 0.0, 0.0);
        }

        //add transform
        this.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        this.setParent(parent);

        //initialize collections
        this.groupObjectList = new List<CardGroupObject>();
        this.groupObjectDict = new Dictionary<CardGroupObject>();
        this.cardObjectList = new List<CardObject>();
        this.cardObjectDict = new Dictionary<CardObject>();
    }

    //sets the state of the card game relevent to engine
    //  adds/removes all systems/entities from the game scene
    //  this can break the on-going game and should only really 
    //  be called when starting a new game or changing game types
    public SetState(state:boolean)
    {
        if(state)
        {
            if(this.isDebugging) { log("card game object manager - enabling all group and card objects"); }
            //all group objects
            for (let i = 0; i < this.groupObjectList.size(); i++) 
            {
                if(!this.groupObjectList.getItem(i).isAddedToEngine())
                {
                    this.groupObjectList.getItem(i).SetInteractionState(false);
                    this.groupObjectList.getItem(i).SetInteractionViewState(false);
                    engine.addEntity(this.groupObjectList.getItem(i)); 
                }
            }
            //all card objects
            for (let i = 0; i < this.cardObjectList.size(); i++) 
            {
                //if(!this.cardObjectList.getItem(i).isAddedToEngine()) 
                this.cardObjectList.getItem(i).SetInteractionState(false);
                this.cardObjectList.getItem(i).SetInteractionViewState(false);
                engine.addEntity(this.cardObjectList.getItem(i)); 
            }
        }
        else
        {
            if(this.isDebugging) { log("card game object manager - disabling all group and card objects"); }
            //all group objects
            for (let i = 0; i < this.groupObjectList.size(); i++) 
            {
                if(this.groupObjectList.getItem(i).isAddedToEngine())
                {
                    this.groupObjectList.getItem(i).SetInteractionState(false);
                    this.groupObjectList.getItem(i).SetInteractionViewState(false);
                    engine.removeEntity(this.groupObjectList.getItem(i));
                }
            }
            //all card objects
            for (let i = 0; i < this.cardObjectList.size(); i++) 
            {
                //if(this.cardObjectList.getItem(i).isAddedToEngine()) 
                this.cardObjectList.getItem(i).SetInteractionState(false);
                this.cardObjectList.getItem(i).SetInteractionViewState(false);
                engine.removeEntity(this.cardObjectList.getItem(i)); 
            }
        }
    }

    //adds a card parent object, returns created object
    //  call this to add locations for discard piles, player hands, or deck stacks
    private slideLength = 1/14;
    private slideHeight = 1/4;
    public AddCardObject(deck:number, house:number, value:number)
    {
        //create object
        let tmp = new CardObject(deck, house, value);
        tmp.setParent(this);
        tmp.addComponent(new PlaneShape());
        //tmp.getComponent(PlaneShape).isPointerBlocker = false;
        tmp.addComponent(new Transform
        ({
            position: new Vector3(((value-6.5)*0.35),((house-1.5)*0.5)+1.25,-2),
            scale: new Vector3(0.32,0.45,0.32),
            rotation: new Quaternion().setEuler(0,180,0)
        }));
        tmp.addComponent(CardObjectManager.cardMaterial);
        tmp.getComponent(PlaneShape).uvs =
        [
            // North side of unrortated plane
            value*this.slideLength,house*this.slideHeight, //lower-left corner
            (value+1)*this.slideLength,house*this.slideHeight, //lower-right corner
            (value+1)*this.slideLength,(house+1)*this.slideHeight, //upper-right corner
            value*this.slideLength,(house+1)*this.slideHeight, //upper left-corner
            // South side of unrortated plane
            1,1-this.slideHeight, // lower-right corner
            1-this.slideLength,1-this.slideHeight, // lower-left corner
            1-this.slideLength,1, // upper-left corner
            1,1, // upper-right corner
        ];

        //assign to collection
        this.cardObjectList.addItem(tmp);
        this.cardObjectDict.addItem(Card.GetKey(deck, house, value), tmp);

        return tmp;
    }

    //adds a card parent object, returns created object
    //  call this to add locations for discard piles, player hands, or deck stacks
    public AddGroupObject(type:number, index:number)
    {
        //dont generate objects for decks
        if(type == 0) return;

        //create object
        let tmp:CardGroupObject = new CardGroupObject();
        tmp.setParent(this);
        tmp.addComponent(new GLTFShape("models/cardgame-core/"+CardObjectManager.objectSetTag+"/"+CardObjectManager.objectModelPaths[type-1]));
        tmp.addComponent(new Transform
        ({
            position: new Vector3(0.5*index,0.11,1.5),
            scale: new Vector3(0.14,0.18,0.14),
            rotation: new Quaternion().setEuler(0,0,0)
        }));

        //assign to collection
        this.groupObjectList.addItem(tmp);
        this.groupObjectDict.addItem(CardObjectManager.GetKey(type, index), tmp);

        return tmp;
    }

    //changes a group object's position
    public SetGroupObjectPosition(type:number, index:number, mod:number, vect:Vector3)
    {
        this.groupObjectDict.getItem(CardObjectManager.GetKey(type, index)).getComponent(Transform).position = vect;
    }

    //changes a group object's positional/display vectors used when displaying cards 
    public SetGroupCardPosition(type:number, index:number, mod:number, vect:Vector3)
    {
        switch(mod)
        {
            //anchoring object position
            case 0:
                this.groupObjectDict.getItem(CardObjectManager.GetKey(type, index)).positionAnchor = vect;
            break;
            //card offset position
            case 1:
                this.groupObjectDict.getItem(CardObjectManager.GetKey(type, index)).positionOffset = vect;
            break;
            //card rotation
            case 2:
                this.groupObjectDict.getItem(CardObjectManager.GetKey(type, index)).positionRotation = vect;
            break;
        }
    }
}

//object representation of a group of cards within the game
//  object contains positional information to apply to newly added cards
export class CardGroupObject extends Entity
{
    //sitting variables
    //  this is optimization of processing at the cost of storage
    //  to ensure we are not attempting to re-add components to the engine (and visa versa)
    stateInteraction:boolean;
    stateInteractionView:boolean;

    //anchoring position is used as the parent of all card display holder
    positionAnchor:Vector3;
    //offset is applied to a card's position for each card's display holder
    //  the magnitude is relative to the card's position in-group
    positionOffset:Vector3;
    //rotation is applied to each card's display holder
    //  the magnitude is relative to the card's position in-group
    positionRotation:Vector3;

    //offset is applied to a card's position within the group that is selected
    positionSelectionOffset:Vector3;

    //collision object used for displaying interactions
    collisionObject:Entity;

    //constructor
    constructor()
    {
        super();

        this.stateInteraction = true;
        this.stateInteractionView = true;

        //create default positionals
        this.positionAnchor = new Vector3();
        this.positionOffset = new Vector3();
        this.positionRotation = new Vector3();
        this.positionSelectionOffset = new Vector3(0, 0.15, 0);

        //create collider object
        this.collisionObject = new Entity();
        this.collisionObject.setParent(this);
        this.collisionObject.addComponent(new BoxShape()).withCollisions = false;
        this.collisionObject.addComponent(CardObjectManager.cardInteractionMaterialSelected);
        this.collisionObject.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(2.5,0.2,3.5),
            rotation: new Quaternion().setEuler(0,0,0)
        }));

        //set default interaction state and view
        this.SetInteractionState(false);
        this.SetInteractionViewState(false);
    }

    //returns anchor position
    public CardAnchor()
    {
        return this.positionAnchor;
    }

    //returns card position for group member by index, 
    //  modified by location of group object, anchor point, and placement in collection
    public CardPosition(index:number)
    {
        return new Vector3
        (
            this.getComponent(Transform).position.x + this.positionAnchor.x + (this.positionOffset.x*index), 
            this.getComponent(Transform).position.y + this.positionAnchor.y + (this.positionOffset.y*index), 
            this.getComponent(Transform).position.z + this.positionAnchor.z + (this.positionOffset.z*index)
        );
    }

    //returns card position for group member by index, additional selection offset applied
    //  modified by location of group object, anchor point, and placement in collection
    public CardSelectedPosition(index:number)
    {
        return new Vector3
        (
            this.getComponent(Transform).position.x + this.positionAnchor.x + (this.positionOffset.x*index) + this.positionSelectionOffset.x, 
            this.getComponent(Transform).position.y + this.positionAnchor.y + (this.positionOffset.y*index) + this.positionSelectionOffset.y, 
            this.getComponent(Transform).position.z + this.positionAnchor.z + (this.positionOffset.z*index) + this.positionSelectionOffset.z
        );
    }

    //returns card rotation modified by location in collection
    public CardRotation(index:number)
    {
        return new Quaternion
        (
            this.positionRotation.x*index, 
            this.positionRotation.y*index, 
            this.positionRotation.z*index
        );
    }

    //sets the current state of the card's interaction object
    public SetInteractionState(state:boolean)
    {
        //enable interaction
        if(state)// && !this.stateInteraction)
        {
            if(!this.collisionObject.isAddedToEngine()) engine.addEntity(this.collisionObject);
            this.stateInteraction = true;
        }
        //disable interaction
        else if(!state)// && this.stateInteraction)
        {
            if(this.collisionObject.isAddedToEngine()) engine.removeEntity(this.collisionObject);
            this.stateInteraction = false;
        }
    }

    //sets the view state of the card's interaction object
    //  this can be used to highlight the object for move previews or selections
    public SetInteractionViewState(state:boolean)
    {
        //changes view to highlight interaction object
        if(state)// && !this.stateInteractionView)
        {
            this.collisionObject.removeComponent(Material);
            this.collisionObject.addComponent(CardObjectManager.cardInteractionMaterialSelected);
            this.stateInteractionView = true;
        }
        //changes view to hide view interaction object
        else if(!state)// && this.stateInteractionView)
        {
            this.collisionObject.removeComponent(Material);
            this.collisionObject.addComponent(CardObjectManager.cardInteractionMaterialInvisible);
            this.stateInteractionView = false;
        }
    }
}

//object representation of a single card within the game
export class CardObject extends Entity
{
    //true when this card is face up
    faceState:boolean;

    //sitting variables
    //  this is optimization of processing at the cost of storage
    //  to ensure we are not attempting to re-add components to the engine (and visa versa)
    stateInteraction:boolean;
    stateInteractionView:boolean;

    //card identity details
    deck:number;
    house:number;
    value:number;

    //collision object
    //  this is currently required because when the plane UVs are changed it ruins
    //  the collision system for some reason. 
    collisionObject:Entity;

    //constructor
    constructor(deck:number, house:number, value:number)
    {
        super();

        this.faceState = true;

        this.stateInteraction = true;
        this.stateInteractionView = true;

        //set identity
        this.deck = deck;
        this.house = house;
        this.value = value;

        //create collision object
        this.collisionObject = new Entity();
        this.collisionObject.setParent(this);
        this.collisionObject.addComponent(new BoxShape()).withCollisions = false;
        this.collisionObject.addComponent(CardObjectManager.cardInteractionMaterialSelected);
        this.collisionObject.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,0.1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        
        //set default interaction state and view
        this.SetInteractionState(false);
        this.SetInteractionViewState(false);
    }

    //sets the face state of the card object, uses rotation to control display
    //TODO: it's likely this will need to be redone to hard-lock card visibility
    //  maybe using a blank holder object to display a card that should be facedown to avoid face-peeking 
    public SetFaceState(state:boolean)
    {
        this.faceState = state
        if(this.faceState)
        {
            this.getComponent(Transform).rotation = new Vector3(180,-90,0).toQuaternion();
        }
        else
        {
            this.getComponent(Transform).rotation = new Vector3(0,90,0).toQuaternion();
        }
    }

    //sets the current state of the card's interaction object
    public SetInteractionState(state:boolean)
    {
        //enable interaction
        if(state)// && !this.stateInteraction)
        {
            if(!this.collisionObject.isAddedToEngine()) engine.addEntity(this.collisionObject);
            this.stateInteractionView = true;
        }
        //disable interaction
        else if(!state)// && this.stateInteraction)
        {
            if(this.collisionObject.isAddedToEngine()) engine.removeEntity(this.collisionObject);
            this.stateInteractionView = false;
        }
    }

    //sets the view state of the card's interaction object
    //  this can be used to highlight the object for move previews or selections
    public SetInteractionViewState(state:boolean)
    {
        //changes view to highlight interaction object
        if(state)// && !this.stateInteractionView)
        {
            this.collisionObject.removeComponent(Material);
            this.collisionObject.addComponent(CardObjectManager.cardInteractionMaterialSelected);
            this.stateInteractionView = true;
        }
        //changes view to hide view interaction object
        else if(!state)// && this.stateInteractionView)
        {
            this.collisionObject.removeComponent(Material);
            this.collisionObject.addComponent(CardObjectManager.cardInteractionMaterialInvisible);
            this.stateInteractionView = false;
        }
    }
}