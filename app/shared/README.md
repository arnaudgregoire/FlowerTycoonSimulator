# Shared Side

This part of the application stores all the object model used in the game, both on the cient and the server.


## Class Description

### Plant

The `Plant` class represent a simple object that grow over time, and can produce other `Plant`. It should be updated as frequently as possible, both on the client and the server.

There is different category of Plants, each with some differences in their properties:
 + Rose
 + Tulip


### Tile
A `Tile` represent a unitary box in the game. Tiles can be bought to link them to a player, seeded to link them to a particular type of Plant, or harvested. Each state is described by a child class of Tile:

 + TileEmpty, a tile that has no owner and no Plant
 + TileBought, a tile that has an owner and no Plant
 + TileSeeded, a tile that has an owner and a Plant

### Farm
The `Farm` is the class that represents the data structure gathering all `Tile` object. It should be unique for every game instance, a single game is linked to a single farm.

The data structure is a 2D Array
### Player

The `Player` class represent any player that is part of a game instance. Its main properties are:
 + the `id`, used to identify the player anywhere
 + the `name`, used to recognize the player
 + the `inventory`, which is a list of `Plant` that can be planted

On the client side, there is no difference between the *current player* and the *opponent*.


## Client Specificity

The client needs to display the game objects, so a `draw()` methods has been added to most class. it uses a *CanvasRenderingContext2D* as an argument, that will be passed from the client-side game instance.


## Server Specificity
