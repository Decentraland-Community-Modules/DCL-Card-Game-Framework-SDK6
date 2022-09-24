import { MenuGroup3D } from "src/utilities/menu-group-3D";
import { CardGameManager } from "src/card-game-core/card-game-manager";
import { CardGameManagerSolitairePatience } from "src/card-games/card-game-patience";
import { CardGameManagerSolitaireFreeCell } from "src/card-games/card-game-solitaire-freecell";

/*      TABLE GAME
    represents an object in the game scene that hosts games for players. each table
    contains its own settings menu, controller for specific games and registry for 
    player groups.

    to add a new game to the table:
        1) create a new class derived from the card game manager class. your new class will
    require you to create the card groups and turn logic required to run a game.
        2) modify SelectGame() and NewGame() functions, simply add the class you created to
    the switch cases with the correct initialization and recast repsectively.

    NOTES: 
        currently this module is not networked, so tables can only support single 
    player games.
        it's likely that both card data and object repositories will be pulled up from the 
    card game manager class into this class when additional game types are implemented. this
    could cut down on the scene strain when changing game types, as each game would not need to
    regenerate all their data/objects.
        
*/
export class GameTable extends Entity
{
    private isDebugging:boolean = false;
    //identity index
    private index:number; get Index() { return this.index; }
    //selected game
    private gameCurrent:number; get CurrentGame() { return this.gameCurrent; }

    //3D menu objects
    menuGroup3D:MenuGroup3D = new MenuGroup3D(this);

    //3D cosmetic objects (table/chairs)
    vanityTable:Entity = new Entity();

    //this must be equal to the number of games currently packed into the module
    gameCount:number = 2;
    //
    gameManagerS:CardGameManagerSolitaireFreeCell;
    gameManagerP:CardGameManagerSolitairePatience;

    //game manager is defined as the core class,
    //  but should be initialized as the card game management class that is in-session
    gameManager:CardGameManager;

    //constructor
    constructor(index:number)
    {
        //base constructor
        super();
        if(this.isDebugging) { log("game table "+index.toString()+" - initializing"); }

        //add transform
        this.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        engine.addEntity(this);

        //set identity
        this.index = index;

        //set up 3D menu
        //  menu toggle
        this.menuGroup3D.AdjustMenuToggle(0, new Vector3(1.6,0.05,-1.6));
        this.menuGroup3D.AdjustMenuToggle(1, new Vector3(0.2,0.2,0.2));
        //  placement
        this.menuGroup3D.getComponent(Transform).position = new Vector3(0,0,2);
        this.menuGroup3D.getComponent(Transform).scale = new Vector3(0.5,0.5,0.5);
        //  title
        //      object
        this.menuGroup3D.AddMenuObject("Title", 2);
        this.menuGroup3D.AdjustMenuObject("Title", 0, new Vector3(0,5,0));
        this.menuGroup3D.AdjustMenuObject("Title", 1, new Vector3(1,1,1));
        //      title text
        this.menuGroup3D.AddMenuText("Title", "TableName", "GAME TABLE 0");
        this.menuGroup3D.AdjustTextDisplay("Title", "TableName", 0, 8);
        this.menuGroup3D.AdjustTextObject("Title", "TableName", 0, new Vector3(0,0.5,0));
        //      game state text
        this.menuGroup3D.AddMenuText("Title", "TableState", "--Uninitialized--");
        this.menuGroup3D.AdjustTextDisplay("Title", "TableState", 0, 6);
        this.menuGroup3D.AdjustTextObject("Title", "TableState", 0, new Vector3(0,-0.5,0));
        //  game type selection display
        //      object
        this.menuGroup3D.AddMenuObject("Type", 1);
        this.menuGroup3D.AdjustMenuObject("Type", 0, new Vector3(0,3.2,0));
        this.menuGroup3D.AdjustMenuObject("Type", 1, new Vector3(0.925,0.5,1));
        //      game name text
        this.menuGroup3D.AddMenuText("Type", "TypeName", "GAME_TYPE");
        this.menuGroup3D.AdjustTextDisplay("Type", "TypeName", 0, 6);
        this.menuGroup3D.AdjustTextObject("Type", "TypeName", 1, new Vector3(0.8,2,0.8));
        //  game type next button
        //      object
        this.menuGroup3D.AddMenuObject("TypeNext", 0);
        this.menuGroup3D.AdjustMenuObject("TypeNext", 0, new Vector3(2.6,3.2,0));
        this.menuGroup3D.AdjustMenuObject("TypeNext", 1, new Vector3(0.5,0.5,1));
        //      text
        this.menuGroup3D.AddMenuText("TypeNext", "TypeNextTxt", ">");
        this.menuGroup3D.AdjustTextDisplay("TypeNext", "TypeNextTxt", 0, 12);
        this.menuGroup3D.AdjustTextObject("TypeNext", "TypeNextTxt", 1, new Vector3(0.8,2,0.8));
        //  primary action: next game type
        this.menuGroup3D.GetMenuObject("TypeNext").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) =>
                {
                    if(this.isDebugging) { log("game table "+index.toString()+" - selecting next game"); }
                    //select next game
                    if(this.gameCurrent+1 == this.gameCount) this.SelectGame(0);
                    else this.SelectGame(this.gameCurrent+1);
                    if(this.isDebugging) { log("game table "+index.toString()+" - selected next game"); }
                },
                {
                    button: ActionButton.ANY,
                    showFeedback: true,
                    hoverText: "[E] Next Game Mode",
                    distance: 8
                }
            )
        );
        //  game type next button
        //      object
        this.menuGroup3D.AddMenuObject("TypePrev", 0);
        this.menuGroup3D.AdjustMenuObject("TypePrev", 0, new Vector3(-2.6,3.2,0));
        this.menuGroup3D.AdjustMenuObject("TypePrev", 1, new Vector3(0.5,0.5,1));
        //      text
        this.menuGroup3D.AddMenuText("TypePrev", "TypePrevTxt", "<");
        this.menuGroup3D.AdjustTextDisplay("TypePrev", "TypePrevTxt", 0, 12);
        this.menuGroup3D.AdjustTextObject("TypePrev", "TypePrevTxt", 1, new Vector3(0.8,2,0.8));
        //  primary action: prev game type
        this.menuGroup3D.GetMenuObject("TypePrev").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) =>
                {
                    if(this.isDebugging) { log("game table "+index.toString()+" - selecting prev game"); }
                    //select previous game
                    if(this.gameCurrent == 0) this.SelectGame(this.gameCount-1);
                    else this.SelectGame(this.gameCurrent-1);
                    if(this.isDebugging) { log("game table "+index.toString()+" - selected prev game"); }
                },
                {
                    button: ActionButton.ANY,
                    showFeedback: true,
                    hoverText: "[E] Prev Game Mode",
                    distance: 8
                }
            )
        );
        //  primary action button (play/reset)
        //      object
        this.menuGroup3D.AddMenuObject("PrimaryAction", 2);
        this.menuGroup3D.AdjustMenuObject("PrimaryAction", 0, new Vector3(1.6,2,0));
        this.menuGroup3D.AdjustMenuObject("PrimaryAction", 1, new Vector3(0.5,0.5,1));
        //      title text
        this.menuGroup3D.AddMenuText("PrimaryAction", "PrimaryActionName", "PLAY");
        this.menuGroup3D.AdjustTextDisplay("PrimaryAction", "PrimaryActionName", 0, 8);
        this.menuGroup3D.AdjustTextObject("PrimaryAction", "PrimaryActionName", 0, new Vector3(0,0,0));
        this.menuGroup3D.AdjustTextObject("PrimaryAction", "PrimaryActionName", 1, new Vector3(2,2,2));
        //  primary action: play/reset game
        this.menuGroup3D.GetMenuObject("PrimaryAction").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) =>
                {
                    this.NewGame();
                },
                {
                    button: ActionButton.ANY,
                    showFeedback: true,
                    hoverText: "[E] PLAY",
                    distance: 8
                }
            )
        );
        //  secondary action button (play/reset)
        //      object
        this.menuGroup3D.AddMenuObject("SecondaryAction", 2);
        this.menuGroup3D.AdjustMenuObject("SecondaryAction", 0, new Vector3(-1.6,2,0));
        this.menuGroup3D.AdjustMenuObject("SecondaryAction", 1, new Vector3(0.5,0.5,1));
        //      title text
        this.menuGroup3D.AddMenuText("SecondaryAction", "SecondaryActionName", "UNDO");
        this.menuGroup3D.AdjustTextDisplay("SecondaryAction", "SecondaryActionName", 0, 8);
        this.menuGroup3D.AdjustTextObject("SecondaryAction", "SecondaryActionName", 0, new Vector3(0,0,0));
        this.menuGroup3D.AdjustTextObject("SecondaryAction", "SecondaryActionName", 1, new Vector3(2,2,2));
        //  primary action: play/reset game
        this.menuGroup3D.GetMenuObject("SecondaryAction").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) =>
                {
                    if(this.swap) { this.swap = false; }
                    else { this.swap = true; }
                    this.gameManager.SetState(this.swap);
                },
                {
                    button: ActionButton.ANY,
                    showFeedback: true,
                    hoverText: "[E] UNDO",
                    distance: 8
                }
            )
        );

        //set up cosmetics display
        this.vanityTable.setParent(this);
        this.vanityTable.addComponent(new GLTFShape("models/game-table/GameTable.glb"));
        this.vanityTable.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));

        //create an instance for every card game this table can host
        // this front-loads all processing to the first scene load and removes objects from engine to save room
        //  solitaire - patience
        this.gameManagerS = new CardGameManagerSolitaireFreeCell(this, this.menuGroup3D.GetMenuObjectText("Title", "TableState").getComponent(TextShape));
        this.gameManagerS.SetState(false);
        //  solitaire - patience
        this.gameManagerP = new CardGameManagerSolitairePatience(this, this.menuGroup3D.GetMenuObjectText("Title", "TableState").getComponent(TextShape));
        this.gameManagerP.SetState(false);

        //set default starting game
        this.gameCurrent = -1;
        this.gameManager = this.gameManagerS;
        this.SelectGame(1);
        this.SelectGame(0);

        if(this.isDebugging) { log("game table "+this.Index.toString()+" - initialized"); }
    }

    swap:boolean = true;

    //displays all available games connected to this table
    public DisplayAvailableGames()
    {

    }

    //selects a game for play, entering the corrosponding starting menu
    public SelectGame(selection:number)
    {
        if(this.isDebugging) { log("game table "+this.Index.toString()+" - selecting game type "+selection.toString()); }
        //ignore requests to select the same game type, no need to regenerate an existing game
        if(this.gameCurrent != selection)
        {
            //clean up previous game
            this.gameManager.SetState(false);

            //change targeted game
            this.gameCurrent = selection;

            //initialize game manager based on demanded game type
            switch(this.gameCurrent)
            {
                //solitaire - free cell
                case 0:
                    this.gameManager = this.gameManagerS;
                break;
                //solitaire - patience
                case 1:
                    this.gameManager = this.gameManagerP;
                break;
            }
            this.menuGroup3D.SetMenuText("Type", "TypeName", this.gameManager.gameName);
            this.gameManager.SetState(true);
        }

        //start a new game for this game type
        this.NewGame();
        if(this.isDebugging) { log("game table "+this.Index.toString()+" - selected game type "+selection.toString()); }
    }

    //begins a new game of the currently selected game type
    //  we're using casting instead of <e> types here simply b.c they are more common-place and 
    //  easier to understand.
    public NewGame()
    {
        if(this.isDebugging) { log("game table "+this.Index.toString()+" - starting new game"); }
        //create new game through casting based on type
        switch(this.gameCurrent)
        {
            //solitaire - free cell
            case 0:
                (this.gameManager as CardGameManagerSolitaireFreeCell).NewGame();
            break;
            //solitaire - patience
            case 1:
                (this.gameManager as CardGameManagerSolitairePatience).NewGame();
            break;
        }
        if(this.isDebugging) { log("game table "+this.Index.toString()+" - started new game"); }
    }
}
