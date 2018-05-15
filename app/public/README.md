# Client Side

This part of the application handle the game logic for the client.


## Main File

The main file is only used to instanciate the `Game` class, and *temprarily* the `WebSocket` that allows the communication between the client and the server.

**TODO**
 + Move the `WebSocket` in the `Game` class, to manipulate it more easily when the game is running
 + Create a new class to take care of the client/server communication, and move the `send()` method in it


 ## Game Class

The `Game` class is where the mmain logic is described. It serves as a container for all secondary class (`AssetLoader`, `UIManager`, `Farm`, `Player`, etc).

The constructor allows the configuration fo the same,

**TODO**
 + 
