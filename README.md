# Decentraland Card Game Kit

This module provides users an easy to use interface for creating and managing card games, and also comes with 6 functional solitaire games: FreeCell, Patience, Spider, Accordion, Pyramid, and Tri Peaks. Each game table can run multiple game types (selectable from the menu) while maintaining minimal in-scene impact on resources. When the module reaches a stable point, the core features will be installable via node package manager to make integration and accessibility easier; this is currently planned for release after peer-to-peer multiplayer has been added to the module.

This module has been heavily documented and will work as-is/out of the box. You can try the live scene [here](https://decentraland-solitaire.herokuapp.com/?realm=v1%7Edecentraland-solitaire.herokuapp.com). Or you can download the scene and run it locally (ensure you have the DCL SDK installed).

This module is split into seperate segments to make management easier.
File Overview:

	game.ts: demo of on-start code
  	game-table: main table objects used to host games, single table can host multiple types of games, running a single game at a time
  	card-game-core: all core objects, management, mechanics for running a card game 
	card-games: specifics for each solitaire card game, including set-up and run-time logic
  	utilities: general extensions, such as lists, dictionaries, and 2d/3d menu management systems

You can find more information inside the files within each of these directories. Most files also contain heavy log text that is visible in your browser's console (just toggle isDebugging=true). Please be aware that these log calls can cause lag during some of the more intensive processes, so if you are running into lag check to ensure these are toggled off.

TODO LIST:

	-networking for multiplayer (this is currently delayed due to the impending launch of SDK7, which might provide simpler implementations)
	-live scene linkage will degrade shortly due to hosting service removing free hosting for smaller projects. alternative hosting services are being researched (likely going to use Render).


BUG LIST:

	currently no known bugs


If you run into any issues or have ideas for future expansion of this module, send me an e-mail at: 
  thecryptotrader69@gmail.com
