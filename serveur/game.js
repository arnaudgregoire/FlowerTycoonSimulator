var Terrain = require('./terrain.js');

/**
 * L'instance Game représente la partie en cours :
 * un partie est composé de joueurs, d'un plateau d'une taille fixé ainsi que d'une durée fixé
 */
class Game{
    constructor(duree, tailleX, tailleY){
        this.duree = duree;
        this.players = [];
        this.terrain = new Terrain(tailleX, tailleY);
    }
}

module.exports = Game;