# Decentraland Card Game Kit

This module provides users an easy to use interface for creating and managing card games, and also comes with a functional freecell solitaire game.

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

You can find more information inside each of these files. Most files also contain heavy log text that is visible in your browser's console (just toggle isDebugging=true).

If you run into any issues, send me an e-mail at: 
  thecryptotrader69@gmail.com