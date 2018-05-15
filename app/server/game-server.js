var nanoid = require("nanoid");
require("../shared/game_core.js");

const LOGG = true;


global.window = global.document = global;

var gameServer = {
  gameList: {},
  gameCount: 0,
  localTime: 0,
  _dt: 0,
  _dte: 0,
  playerQueue: [],
  log: function() { if(verbose) console.log.apply(this,arguments) }
};
module.exports = gameServer;

gameServer._dt = new Date().getTime();
gameServer._dte = new Date().getTime();

gameServer.findGame = function (player) {
  this.log("Looking for a new game - Current game count: ", this.gameCount);

  if(this.gameCount > 0) {
    let gameJoined = false;
    let game = null;

    for (var gameId in this.gameList) {
      if(!this.gameList.hasOwnProperty(gameId)) continue;

      game = this.gameList[gameId];
      if(game.playerCount < game.MAX_PLAYER_COUNT) {
        gameJoined = true;

        // Update the game state
        game.playerClients.push(player);
        game.gameCore.players.other.instance = player;
        game.playerCount++;

        this.startGame(game);
      }
    }

    if(!gameJoined) {   // No game can be joined, create a new one
      this.createGame(player)
    }

  }
  else {  // No game has been created yet, create the first one
    this.createGame(player);
  }
}


gameServer.createGame = function (player) {
  let gameId = nanoid();

  let game = {
    id: gameId,
    playerHost: player,
    playerClients: [],
    playerCount: 1
  }
  this.gameList[gameId] = game;
  this.gameCount++;

  game.gameCore = new game_core();
  this.gameList[gameId].update(Date.now());

  player.send("s.h" + String(game.gameCore.localTime).replace(".", "-"));
  player.gameId = gameId;
  player.hosting = true;

  return game;
}


gameServer.startGame = function (game) {
  // s: server message, j: join a game, data: host ID
  let client;
  for (client of game.playerClients) {
    client.send("s.j." + game.playerHost.userId);
    client.game = game;
  }

  // s: server, r: restart the game,
  let msg = "s.r" + String(game.gameCore.localTime).replace(".", "-");
  game.playerHost.send(msg)
  for (client of game.playerClients) {
    client.send(msg);
  }

  game.active = true;
}


gameServer.endGame = function (gameId, userId) {
  let game = this.gameList[gameId];
  if(!!game){ this.log("Unable to end game with ID " + gameId); return; }

  game.gameCore.stopUpdate();
  if(game.playerCount > 1){   // There is at least one player that is not host

    if(userId == game.playerHost.userId) { // the host is leaving, find a new game for all players
      for (client of game.playerClients) {
        client.send("s.e");   // server, end game
        this.findGame(client);
      }
      delete this.gameList[gameId];
      this.gameCount--;
    }
    else{   // if a player leaves, kill him in game
      game.gameCore.killPlayer(userId);
    }
  }
}


gameServer.onMessage = function (client, message) {
  let messageParts = message.split(".");
  let messageType = messageParts[0];
}

setInterval(function(){
    gameServer._dt = Date().now() - gameServer._dte;
    gameServer._dte = Date().now();
    gameServer.localTime += gameServer._dt*0.001;
}, 4);
