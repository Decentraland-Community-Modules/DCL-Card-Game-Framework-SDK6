/*      TABLE GAME
    used to manage all game tables in the scene. only one instance should be created
    and initialized through the game scene. tables are organized through a set of
    collections, with the primary access by request.

    NOTE: currently this module is not networked, so tables can only support single 
    player games.
*/
import { List, Dictionary } from "src/utilities/collections";
import { GameTable } from "./game-table";
export class GameTableManager extends Entity
{
    private isDebugging:boolean = false;
    private nextIndex;

    //collection of all tables
    private gameTableList:List<GameTable>;
    private gameTableDict:Dictionary<GameTable>;

    //returns true if requested game table exists
    public HasGameTable(index:number) { return this.gameTableDict.containsKey(index.toString()); }

    //returns the requested game table
    public GetGameTable(index:number) { return this.gameTableDict.getItem(index.toString()); }

    //constructor
    constructor()
    {
        super();
        if(this.isDebugging) { log("game table manager - initializing"); }

        //add transform
        this.addComponent(new Transform
        ({
            position: new Vector3(8,0,8),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        engine.addEntity(this);

        this.nextIndex = 0;
        
        //initialize collections
        this.gameTableList = new List<GameTable>();
        this.gameTableDict = new Dictionary<GameTable>();
        
        if(this.isDebugging) { log("game table manager - initialized"); }
    }

    //creates a game table at the given location
    public CreateGameTable(position:Vector3)
    {
        if(this.isDebugging) { log("game table manager - creating new game table "+(this.nextIndex).toString()); }
        let table:GameTable = new GameTable(this.nextIndex++);
        table.setParent(this);
        table.getComponent(Transform).position = position;

        this.gameTableList.addItem(table);
        this.gameTableDict.addItem(table.Index.toString(), table);
        if(this.isDebugging) { log("game table manager - created new game table "+table.Index.toString()); }
    }
}