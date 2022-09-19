/*      CARD MOVEMENT SYSTEM
        manages movement of cards across the all game tables
    within the scene. this also includes a pooling system to
    take direct control of how many objects can be mobile at
    one time. if a request is made when the number of mobile
    objects is already max an already mobile object will
    be instantly placed at its target destination and the
    requested object will begin to move.
*/
//   movement system for pathed platforms
import { List, Dictionary } from "../utilities/collections";
@Component("CardGameMovementSystem")
export class CardGameMovementSystem implements ISystem  
{
    private countMax:number;
    private countCurrent:number;
    private commandList:List<MovementCommand>;

    private commandActiveList:List<MovementCommand>;
    private commandActiveDict:Dictionary<MovementCommand>;


    //constructor
    constructor()
    {
        this.countMax = 6;
        this.countCurrent = 0;
        this.commandList = new List<MovementCommand>();
        this.commandActiveList = new List<MovementCommand>();
        this.commandActiveDict = new Dictionary<MovementCommand>();

        for (let i = 0; i < this.countMax; i++) 
        {
            this.commandList.addItem(new MovementCommand(i));
        }
    }
    
    //primary use is to move all commanded object
    update(dt: number) 
    {
        //process each command, starting from the back of the list b.c it can change sizes
        for (let i = 0; i < this.commandActiveList.size(); i++)
        {
            let cmd:MovementCommand = this.commandActiveList.getItem(i);
            if (this.commandActiveList.getItem(i).distance <= 1) 
            {
                if(cmd.target != undefined)
                {
                    cmd.target.getComponent(Transform).position = Vector3.Lerp(cmd.start, cmd.end, cmd.distance);
                    cmd.distance +=  dt / cmd.length;
                }
            } 
            else
            {
                this.RemoveMovementCommand(cmd);
            }
        }
    }

    //adds a command to the system
    public AddMovementCommand(target:Entity, start:Vector3, end:Vector3)
    {
        //push to next command on the list
        this.countCurrent++;
        if(this.countCurrent >= this.commandList.size()) { this.countCurrent = 0; }
        let cmd:MovementCommand = this.commandList.getItem(this.countCurrent);

        //check active movement list
        if(this.commandActiveDict.containsKey(cmd.index.toString()))
        {
            this.RemoveMovementCommand(cmd);
        }

        //set command and add system
        cmd.Set(target, start, end);
        this.commandActiveList.addItem(cmd);
        this.commandActiveDict.addItem(cmd.index.toString(), cmd);
    }

    //removes a command from the system
    public RemoveMovementCommand(command:MovementCommand)
    {
        this.commandActiveList.removeItem(command);
        this.commandActiveDict.removeItem(command.index.toString());
        //ensure position is snapped to target
        if(command.target != undefined) command.target.getComponent(Transform).position = command.end;
    }
}
//represents a single request to move a piece from one point to another
export class MovementCommand
{
    index:number;

    //targeted object
    target:Entity|undefined;
    //positional details
    start:Vector3;
    end:Vector3;
    //in-progress details
    length:number;      //time this will take
    distance:number;    //current distance travelled

    constructor(index:number)
    {
        this.index = index;
        this.target = undefined;
        this.start = new Vector3();
        this.end = new Vector3();
        this.length = 1;
        this.distance = 0;
    }

    public Set(target:Entity, start:Vector3, end:Vector3)
    {
        this.target = target;
        this.start = start;
        this.end = end;
        this.length = 0.25;
        this.distance = 0;
    }
}