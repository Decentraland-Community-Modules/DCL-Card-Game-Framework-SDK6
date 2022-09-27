/*      MENU GROUP 3D
    used to create a 3d menu group in the game scene. menu objects can be created and 
    organized through an instance of this manager.

    the menu group and toggle button are placed as parents of the object given, all
    menu objects are parented onto the menu group, and all text shape entities are
    parented to those menu objects.
*/
import { List, Dictionary } from "collections";
@Component("MenuGroup3D")
export class MenuGroup3D extends Entity 
{
    //address to target models
    //  NOTE: this should be static, but static defs seem to break in the SDK deployment
    private object_locations:string[] = 
    [
        "models/utilities/menuObjSquare.glb",
        "models/utilities/menuObjShort.glb",
        "models/utilities/menuObjLong.glb"
    ];

    //action object used to toggle main menu object
    private menuToggleState:number = 0;
    private menuToggle:Entity = new Entity();
    //collections for entity access
    private menuList:List<MenuObject3D>;
    private menuDict:Dictionary<MenuObject3D>;

    //constructor, takes in an entity that will be used when parenting
    constructor(parent:Entity)
    {
        super();

        //add transform
        this.setParent(parent);
        this.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));

        //set up menu toggle
        this.menuToggle.setParent(parent);
        this.menuToggle.addComponent(new GLTFShape("models/utilities/menuObjSettingsGearBox.glb"));
        this.menuToggle.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        //  primary action: toggle
        this.menuToggle.addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) =>
                {
                    if (e.buttonId == 1) { this.ToggleMenuState(); }
                },
                {
                    button: ActionButton.ANY,
                    showFeedback: true,
                    hoverText: "[E] Toggle Menu",
                    distance: 8
                }
            )
        );

        //initialize collections
        this.menuList = new List<MenuObject3D>();
        this.menuDict = new Dictionary<MenuObject3D>();
    }

    //toggles the current menu state
    public ToggleMenuState()
    {
        if(this.menuToggleState == 0) this.SetMenuState(1);
        else this.SetMenuState(0);
    }

    //sets the state of the primary menu tree
    public SetMenuState(state:number)
    {
        //enable menu
        if(state == 0)
        {
            engine.addEntity(this);
        }
        //disable menu
        else
        {
            engine.removeEntity(this);
        }
        this.menuToggleState = state;
    }

    //menu toggle object
    //  type: 0->position, 1->scale, 2->rotation
    public AdjustMenuToggle(type:number, vect:Vector3)
    {
        switch(type)
        {
            case 0:
                this.menuToggle.getComponent(Transform).position = vect;
            break;
            case 1:
                this.menuToggle.getComponent(Transform).scale = vect;
            break;
            case 2:
                this.menuToggle.getComponent(Transform).rotation = new Quaternion(vect.x, vect.y, vect.z);
            break;
        }
    }

    //prepares a menu object of the given size/shape, with the given text, 
    //  registered under the given name
    public AddMenuObject(name:string, type:number)
    {
        //create and prepare entities
        var tmp:MenuObject3D = new MenuObject3D(this.object_locations[type], name);
        tmp.setParent(this);

        //register object to collections
        this.menuList.addItem(tmp);
        this.menuDict.addItem(name, tmp);
    }

    //returns the requested menu object
    public GetMenuObject(objName:string):MenuObject3D
    {
        return this.menuDict.getItem(objName);
    }

    //returns the requested menu object
    public GetMenuObjectText(objName:string, textName:string):Entity
    {
        return this.menuDict.getItem(objName).GetTextObject(textName);
    }

    //changes a targeted menu object entity
    //  type: 0->position, 1->scale, 2->rotation
    public AdjustMenuObject(name:string, type:number, vect:Vector3)
    {
        switch(type)
        {
            case 0:
                this.menuDict.getItem(name).getComponent(Transform).position = vect;
            break;
            case 1:
                this.menuDict.getItem(name).getComponent(Transform).scale = vect;
            break;
            case 2:
                this.menuDict.getItem(name).getComponent(Transform).rotation = new Quaternion(vect.x, vect.y, vect.z);
            break;
        }
    }

    //prepares a menu object of the given size/shape, with the given text, 
    //  registered under the given name
    public AddMenuText(nameObj:string, nameTxt:string, text:string)
    {
        this.menuDict.getItem(nameObj).AddTextObject(nameTxt, text);
    }

    //sets a text object's display text
    public SetMenuText(nameObj:string, nameTxt:string, text:string)
    {
        this.menuDict.getItem(nameObj).ChangeText(nameTxt, text);
    }

    //changes a text object's textshape settings
    public AdjustTextObject(nameObj:string, nameTxt:string, type:number, value:Vector3)
    {
        this.menuDict.getItem(nameObj).AdjustTextObject(nameTxt, type, value);
    }

    //changes a text object's textshape settings
    public AdjustTextDisplay(nameObj:string, nameTxt:string, type:number, value:number)
    {
        this.menuDict.getItem(nameObj).AdjustTextDisplay(nameTxt, type, value);
    }
}

@Component("MenuObject3D")
export class MenuObject3D extends Entity 
{
    //access key
    public Name:string;

    //collections of all text entities
    textList:List<Entity>;
    textDict:Dictionary<Entity>;

    //constructor
    constructor(model:string, nam:string)
    {
        super();
        
        //add transform
        this.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        this.addComponent(new GLTFShape(model));

        //set access name
        this.Name = nam;

        //collections
        this.textList = new List<Entity>();
        this.textDict = new Dictionary<Entity>();
    }

    public GetTextObject(name:string):Entity
    {
        return this.textDict.getItem(name);
    }

    //prepares a text object with the given text, 
    //  registered under the given name
    public AddTextObject(name:string, text:string)
    {
        //create and prepare entity
        var tmp:Entity = new Entity();
        tmp.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        tmp.setParent(this);

        //add text shape with defaulted values
        tmp.addComponent(new TextShape(text));
        tmp.getComponent(TextShape).color = Color3.Black();
        tmp.getComponent(TextShape).fontSize = 9;

        //register object to collections
        this.textList.addItem(tmp);
        this.textDict.addItem(name, tmp);
    }

    //changes a targeted text object entity
    //  type: 0->position, 1->scale, 2->rotation
    public AdjustTextObject(name:string, type:number, vect:Vector3)
    {

        //let entity = this.textDict.getItem(name).getComponent(Transform);
        switch(type)
        {
            case 0:
                this.textDict.getItem(name).getComponent(Transform).position = vect;
            break;
            case 1:
                this.textDict.getItem(name).getComponent(Transform).scale = vect;
            break;
            case 2:
                this.textDict.getItem(name).getComponent(Transform).rotation = new Quaternion(vect.x, vect.y, vect.z);
            break;
        }
    }

    //changes a targeted menu object entity
    //  type: 0->font size
    public AdjustTextDisplay(name:string, type:number, value:number)
    {
        switch(type)
        {
            case 0:
                this.textDict.getItem(name).getComponent(TextShape).fontSize = value;
            break;
        }
    }

    //changes the text of a targeted textshape
    public ChangeText(name:string, text:string)
    {
        this.textDict.getItem(name).getComponent(TextShape).value = text;
    }
}