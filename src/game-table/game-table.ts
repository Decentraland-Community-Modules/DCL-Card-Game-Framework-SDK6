/*      TABLE GAME
    represents an object in the game scene that hosts games for players. each table
    contains its own settings menu, controller for specific games and registry for 
    player groups.

    to add a new game to the table:
        1) create a new class derived from the CardGameManager class. your new class will
    require you to create the card groups and turn logic required to run a game.
        2) add your CardGameManager to the GameTable:
            -add an additional def to card-game-defs.ts file, fill in your game's details
            -add an instance of your class to GameTable (under 'incorporated games')
            -add an initialization of your class to the constructor (near end of function)
            -modify SelectGame(), adding your class to the switch table 
            -modify NewGame(), adding your class to the switch table

    NOTES: 
        currently this module is not networked, so tables can only support single 
    player games.
*/
import { data_card_game } from "src/card-games/card-game-defs";
import { MenuGroup2D } from "src/utilities/menu-group-2D";
import { MenuGroup3D } from "src/utilities/menu-group-3D";
import { CardGameResources } from "src/card-game-core/card-game-resources";
import { CardGameManager } from "src/card-game-core/card-game-manager";
import { CardGameManagerSolitairePatience } from "src/card-games/card-game-patience";
import { CardGameManagerSolitaireFreeCell } from "src/card-games/card-game-solitaire-freecell";
import { CardGameManagerSolitaireSpider } from "src/card-games/card-game-spider";
import { CardGameManagerSolitaireAccordion } from "src/card-games/card-game-accordion";
import { CardGameManagerSolitairePyramid } from "src/card-games/card-game-pyramid";
import { CardGameManagerSolitaireTriPeaks } from "src/card-games/card-game-tri-peaks";
export class GameTable extends Entity
{
    private isDebugging:boolean = false;
    //identity index
    private index:number; get Index() { return this.index; }
    //selected game
    private gameCurrent:number; get CurrentGame() { return this.gameCurrent; }

    //2D menu objects
    menuGroup2D:MenuGroup2D = new MenuGroup2D(this);

    //3D menu objects
    menuGroup3D:MenuGroup3D = new MenuGroup3D(this);

    //3D cosmetic objects (table/chairs)
    vanityTable:Entity = new Entity();

    //resource manager
    gameResources:CardGameResources;

    //incorporated games
    gameManagerFreeCell:CardGameManagerSolitaireFreeCell;
    gameManagerPatience:CardGameManagerSolitairePatience;
    gameManagerSpider:CardGameManagerSolitaireSpider;
    gameManagerAccordion:CardGameManagerSolitaireAccordion;
    gameManagerPyramid:CardGameManagerSolitairePyramid;
    gameManagerTriPeaks:CardGameManagerSolitaireTriPeaks;

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

        //set up 2D menu
        //  menu toggle
        this.menuGroup2D.AdjustMenuToggle(0, new Vector3(1.2,0.05,-1.6));
        this.menuGroup2D.AdjustMenuToggle(1, new Vector3(0.2,0.2,0.2));
        //  background
        //      object
        this.menuGroup2D.AddMenuObject("Background");
        this.menuGroup2D.AdjustMenuObject("Background", 1, new Vector2(800,600));
        this.menuGroup2D.AdjustMenuColour("Background", new Color4(0.2, 0.2, 0.2, 1));
        //  title
        //      bakcground object
        this.menuGroup2D.AddMenuObject("TitleBg");
        this.menuGroup2D.AdjustMenuObject("TitleBg", 0, new Vector2(0,30));
        this.menuGroup2D.AdjustMenuObject("TitleBg", 1, new Vector2(600,80));
        this.menuGroup2D.AdjustMenuObject("TitleBg", 2, new Vector2(1,0));
        this.menuGroup2D.AdjustMenuColour("TitleBg", new Color4(0.2, 0.2, 0.2, 1));
        //      object
        this.menuGroup2D.AddMenuObject("Title");
        this.menuGroup2D.AdjustMenuObject("Title", 0, new Vector2(0,20));
        this.menuGroup2D.AdjustMenuObject("Title", 1, new Vector2(580,60));
        this.menuGroup2D.AdjustMenuObject("Title", 2, new Vector2(1,0));
        //      text
        this.menuGroup2D.AddMenuText("Title", "Text", "GAME_TITLE_TEXT");
        this.menuGroup2D.AdjustTextDisplay("Title", "Text", 0, 40);
        //  desc short head
        //      object
        this.menuGroup2D.AddMenuObject("DescShortHead");
        this.menuGroup2D.AdjustMenuObject("DescShortHead", 0, new Vector2(-320,-60));
        this.menuGroup2D.AdjustMenuObject("DescShortHead", 1, new Vector2(120,40));
        this.menuGroup2D.AdjustMenuObject("DescShortHead", 2, new Vector2(1,0));
        //      text
        this.menuGroup2D.AddMenuText("DescShortHead", "Text", "About:");
        this.menuGroup2D.AdjustTextDisplay("DescShortHead", "Text", 0, 30);
        //  desc short body
        //      object
        this.menuGroup2D.AddMenuObject("DescShortBody");
        this.menuGroup2D.AdjustMenuObject("DescShortBody", 0, new Vector2(0,-102.5));
        this.menuGroup2D.AdjustMenuObject("DescShortBody", 1, new Vector2(760,120));
        this.menuGroup2D.AdjustMenuObject("DescShortBody", 2, new Vector2(1,0));
        //      text
        this.menuGroup2D.AddMenuText("DescShortBody", "Text", data_card_game[0].DescShort);
        this.menuGroup2D.AdjustTextObject("DescShortBody", "Text", 3, new Vector2(0,1));
        this.menuGroup2D.AdjustTextDisplay("DescShortBody", "Text", 0, 18);
        //  desc win head
        //      object
        this.menuGroup2D.AddMenuObject("DescWinHead");
        this.menuGroup2D.AdjustMenuObject("DescWinHead", 0, new Vector2(-320,-240));
        this.menuGroup2D.AdjustMenuObject("DescWinHead", 1, new Vector2(120,40));
        this.menuGroup2D.AdjustMenuObject("DescWinHead", 2, new Vector2(1,0));
        //      text
        this.menuGroup2D.AddMenuText("DescWinHead", "Text", "Goal:");
        this.menuGroup2D.AdjustTextDisplay("DescWinHead", "Text", 0, 30);
        //  desc win body
        //      object
        this.menuGroup2D.AddMenuObject("DescWinBody");
        this.menuGroup2D.AdjustMenuObject("DescWinBody", 0, new Vector2(0,-282.5));
        this.menuGroup2D.AdjustMenuObject("DescWinBody", 1, new Vector2(760,40));
        this.menuGroup2D.AdjustMenuObject("DescWinBody", 2, new Vector2(1,0));
        //      text
        this.menuGroup2D.AddMenuText("DescWinBody", "Text", data_card_game[0].descWin);
        this.menuGroup2D.AdjustTextObject("DescWinBody", "Text", 3, new Vector2(0,1));
        this.menuGroup2D.AdjustTextDisplay("DescWinBody", "Text", 0, 18);
        //  desc rules head
        //      object
        this.menuGroup2D.AddMenuObject("DescRulesHead");
        this.menuGroup2D.AdjustMenuObject("DescRulesHead", 0, new Vector2(-320,-340));
        this.menuGroup2D.AdjustMenuObject("DescRulesHead", 1, new Vector2(120,40));
        this.menuGroup2D.AdjustMenuObject("DescRulesHead", 2, new Vector2(1,0));
        //      text
        this.menuGroup2D.AddMenuText("DescRulesHead", "Text", "Rules:");
        this.menuGroup2D.AdjustTextDisplay("DescRulesHead", "Text", 0, 30);
        //  desc rules body
        //      object
        this.menuGroup2D.AddMenuObject("DescRulesBody");
        this.menuGroup2D.AdjustMenuObject("DescRulesBody", 0, new Vector2(0,-382.5));
        this.menuGroup2D.AdjustMenuObject("DescRulesBody", 1, new Vector2(760,200));
        this.menuGroup2D.AdjustMenuObject("DescRulesBody", 2, new Vector2(1,0));
        //      text
        this.menuGroup2D.AddMenuText("DescRulesBody", "Text", "RULES_TEXT");
        this.menuGroup2D.AdjustTextObject("DescRulesBody", "Text", 3, new Vector2(0,1));
        this.menuGroup2D.AdjustTextDisplay("DescRulesBody", "Text", 0, 18);
        //final call: button
        this.menuGroup2D.PrepareMenuClose();

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
                    if(this.gameCurrent+1 == data_card_game.length) this.SelectGame(0);
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
                    if(this.gameCurrent == 0) this.SelectGame(data_card_game.length-1);
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
        this.menuGroup3D.AdjustMenuObject("PrimaryAction", 0, new Vector3(0,2,0));
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
        /*this.menuGroup3D.AddMenuObject("SecondaryAction", 2);
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
        );*/

        //set up cosmetics display
        this.vanityTable.setParent(this);
        this.vanityTable.addComponent(new GLTFShape("models/game-table/GameTable.glb"));
        this.vanityTable.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));

        //create resource manager
        this.gameResources = new CardGameResources(this, this.menuGroup3D.GetMenuObjectText("Title", "TableState").getComponent(TextShape));

        //create an instance for every card game this table can host
        // this front-loads all processing to the first scene load and removes objects from engine to save room
        //  solitaire - patience
        this.gameManagerFreeCell = new CardGameManagerSolitaireFreeCell(this.gameResources);
        this.gameManagerFreeCell.SetState(false);
        //  solitaire - patience
        this.gameManagerPatience = new CardGameManagerSolitairePatience(this.gameResources);
        this.gameManagerPatience.SetState(false);
        //  solitaire - spider
        this.gameManagerSpider = new CardGameManagerSolitaireSpider(this.gameResources);
        this.gameManagerSpider.SetState(false);
        //  solitaire - accordion
        this.gameManagerAccordion = new CardGameManagerSolitaireAccordion(this.gameResources);
        this.gameManagerAccordion.SetState(false);
        //  solitaire - pyramid
        this.gameManagerPyramid = new CardGameManagerSolitairePyramid(this.gameResources);
        this.gameManagerPyramid.SetState(false);
        //  solitaire - tri peaks
        this.gameManagerTriPeaks = new CardGameManagerSolitaireTriPeaks(this.gameResources);
        this.gameManagerTriPeaks.SetState(false);

        //set default starting game
        this.gameCurrent = -1;
        this.gameManager = this.gameManagerFreeCell;

        //asset warm up
        //  this front-loads all asset creation to reduce lag during game swaps
        for(let i=0; i<data_card_game.length; i++)
        {
            this.SelectGame(data_card_game.length-i-1);
        }

        //debugging selection test (safe to remove)
        //this.SelectGame(2);

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
                    this.gameManager = this.gameManagerFreeCell;
                break;
                //solitaire - patience
                case 1:
                    this.gameManager = this.gameManagerPatience;
                break;
                //solitaire - spider
                case 2:
                    this.gameManager = this.gameManagerSpider;
                break;
                //solitaire - accordion
                case 3:
                    this.gameManager = this.gameManagerAccordion;
                break;
                //solitaire - pyramid
                case 4:
                    this.gameManager = this.gameManagerPyramid;
                break;
                //solitaire - tri peaks
                case 5:
                    this.gameManager = this.gameManagerTriPeaks;
                break;
            }

            //update table 3d display
            this.menuGroup3D.SetMenuText("Type", "TypeName", data_card_game[this.gameCurrent].name);

            //update table 2d display
            this.menuGroup2D.SetMenuText("Title", "Text", data_card_game[this.gameCurrent].name);
            this.menuGroup2D.SetMenuText("DescShortBody", "Text", data_card_game[this.gameCurrent].DescShort);
            this.menuGroup2D.SetMenuText("DescWinBody", "Text", data_card_game[this.gameCurrent].descWin);
            //  desc rules body
            let str:string = "";
            for(let i=0; i<data_card_game[this.gameCurrent].descRules.length; i++)
            {
                str += i.toString()+": "+data_card_game[this.gameCurrent].descRules[i];
                if(i != data_card_game[this.gameCurrent].descRules.length-1) str += "\n";
            }
            this.menuGroup2D.SetMenuText("DescRulesBody", "Text", str);

            //set delgates for current manager
            this.gameResources.GetCurrentCardData = this.gameManager.GetCurrentCardData;
            this.gameResources.GetCurrentCardCollection = this.gameManager.GetCurrentCardCollection;
            this.gameResources.GetCollection = this.gameManager.GetCollection;
            this.gameResources.GetCardFromCollection = this.gameManager.GetCardFromCollection;
            this.gameResources.DisplayMoves = this.gameManager.DisplayMoves;
            this.gameResources.SelectCard = this.gameManager.SelectCard;
            this.gameResources.SelectGroup = this.gameManager.SelectGroup;
            this.gameResources.MoveCard = this.gameManager.MoveCard;
            this.gameResources.GetCardData = this.gameManager.GetCardData;
            this.gameResources.GetCardObject = this.gameManager.GetCardObject;
            this.gameResources.GetGroupObject = this.gameManager.GetGroupObject;
            this.gameResources.ApplyCardSelection = this.gameManager.ApplyCardSelection;
            this.gameResources.DeselectCard = this.gameManager.DeselectCard;

            //reset resources and activate movement system
            this.gameResources.Reset();
            engine.addSystem(this.gameResources.movementSystem);

            //initialize newly selected manager
            this.gameManager.Initialize();
        }

        //start a new game for this game type
        this.NewGame();
        if(this.isDebugging) { log("game table "+this.Index.toString()+" - selected game type "+selection.toString()); }
    }

    //begins a new game of the currently selected game
    public NewGame()
    {
        if(this.isDebugging) { log("game table "+this.Index.toString()+" - starting new game"); }
        this.gameManager.NewGame();
        if(this.isDebugging) { log("game table "+this.Index.toString()+" - started new game"); }
    }
}