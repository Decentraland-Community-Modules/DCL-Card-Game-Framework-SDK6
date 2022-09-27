# Decentraland Card Game Kit

This module provides users an easy to use interface for creating and managing card games, and also comes with 2 functional solitaire games: FreeCell and Patience. Each game table can run multiple game types (selectable from the menu) while maintaining minimal in-scene impact on resources. When the module reaches a stable point, the core features will be installable via node package manager to make integration and accessibility easier; this is currently planned for release after peer-to-peer multiplayer has been added to the module.

This module has been heavily documented and will work as-is/out of the box. You can try it out here:
https://decentraland-solitaire.herokuapp.com/?realm=v1%7Edecentraland-solitaire.herokuapp.com

or by downloading the scene and running it locally (ensure you have the DCL SDK installed).

This module is split into seperate segments to make management easier.
File Overview:

	game.ts: demo of on-start code
  	game-table: main table objects used to host games, single table can host multiple types of games, running a single game at a time
  	card-game-core: all core objects, management, mechanics for running a card game 
	card-game-solitaire-freecell: specifics for the solitaire card game
  	utilities: general extensions, such as lists, dictionaries, and a 3d menu management system

You can find more information inside each of these files. Most files also contain heavy log text that is visible in your browser's console (just toggle isDebugging=true). Please be aware that these log calls can cause lag during some of the more intensive processes, so if you are running into lag check to ensure these are toggled off.

TODO LIST:

	remove front-loading all installed card games, this will cause scene-bloat when we get move loaded and is worth it even if i causes lag when the game is selected for the firs time
	
BUG LIST:

-currently no known bugs

If you run into any issues or have ideas for future expansion of this module, send me an e-mail at: 
  thecryptotrader69@gmail.com
