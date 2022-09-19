/*    CARD GAME MODULE DEMO - FREE CELL SOLITAIRE
    this module provides easy to use interfaces to be used when developing card games 
    for decentraland. this module is also packed with an example of implementation through
    the game of FreeCell Solitaire. additional information about the core functionality of
    both the module and game can be found within their corresponding files.
    
    Author: Alex Pazder, thecryptotrader69@gmail.com

    Notes:
    --typescript does not require semi-colons ';' I use them here only because
    the majority of my irl work requires them in the languages we use, so I
    find it easier to keep that practice alive.
    --our debugging logs can be fairly heavy throughout the code, if you notice
    lag throughout the scene and are not interested in the debug calls ensure
    they are toggled off.
    --there is currently no networking in this module, so multiplayer games cannot
    be created using this module. however there are benifits to this, such as allowing
    any number of players to use the same gaming table and the reduction of required processing
    when running multiple tables. the module may be modified at a later date to provide 
    networking interfaces.
*/
//imports

import { GameTableManager } from "./game-table/game-table-manager";

//DEMO CODE:
//  create and add table manager
const gameTableManager = new GameTableManager();
engine.addEntity(gameTableManager);
//  create a single game table in the middle of the scene
gameTableManager.CreateGameTable(new Vector3(0,0,0));
