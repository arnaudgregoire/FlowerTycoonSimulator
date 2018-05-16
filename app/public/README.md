# Client Side

This part of the application handle the game logic for the client.


## Main File

The main file is used to describe & load the Javascript dependencies of the game (with the `JsLoader`), and instanciate the `Game` class that will do all the work.


## Game Class

The `Game` class is where the main logic is described. It serves as a container for all secondary class (`AssetLoader`, `UIManager`, `Farm`, `Player`, etc) and manage their states.
It should be used as a global **event listener**: any class can dispatch a `CustomEvent`, and the `Game` will handle the event and

**TODO**
 + Implement the event handler for each event listener


## UIManager Class

This class is a wrapper for all sub-manager class. It provide an entry point to the game to change the DOM-based interface.

### LoginManager

This class is used to toggle the login screen. It adds an overlay to the DOM `document`, and display a `form` to authenticate the user. In most use-case, it will be displayed only once.
It also raise a `"sendLogin"` event when the user wants to confirm its identity.

### UserManager

This class is linked to the `#user-info` element, and currently only display the name of the player.

### InfoManager

This class is linked to the `#click-info` element. It displays any message that is sent by the game to the UIManager.

### InventoryManager

This class is linked to the `#inventory` element. It displays the current player `inventory`, and raises an `inventoryClick` event when the client click on it.

### BoardManager

This class is linked to the `#leaderboard` element. It displays all the player that are currently connected to the same game, with name and score information.

The board needs to be optimized to only update itself when the order of the player in the list changes.

### ActionsManager

This class is linked to the `#game` element. It raises a specific click event every time an action button is clicked, and can be used to toggle the state of each button.


## SocketManager

The `SocketManager` is a wrapper for the WebSocket / Socket.io connexion between the client and the server.

It needs to main methods: `sendMessage()`, called by the game when it needs confirmation from the server, and `handleResponse()`, that raise an event with the server information that is handled by the game.


## AssetLoader

A small utility class used to load & store the game images. The game should wait for *all* assets to load before starting.
