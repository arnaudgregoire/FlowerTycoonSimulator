var Terrain = require('./terrain.js');

class Game{
    constructor(duree, tailleX, tailleY){
        this.duree = duree;
        this.players = [];
        this.terrain = new Terrain(tailleX, tailleY);
    }
}

module.exports = Game;