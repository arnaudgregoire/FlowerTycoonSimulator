var utils = require("../utils.js");
var PlanteFactory = require("./plantefactory.js");

/**
 * La classe parente Plante cote serveur
 * Ceci est une classe abstraite qui n'a vocation à ne jamais etre instancié
 * Une plante a un cycle de vie bien défini avec les états states
 * Les états state évolue au fur et à mesure du temps
 * L'état state=3 déclenche la floraison de la fleur
 * L'état 5 fait faner les fleurs et apparaitre les graines
 * A l'état 9, la plante meurt
 * Sur serveur uniquement pour l'instant
 */
class Plante{
    constructor(){
        this.birth = 0;
        this.age = 0;
        this.name = "";
        this.state = 0;
        this.speed = 0;
        this.nbFlowers = 0;
        this.nbSeeds = 0;
        this.bloomed = false;
        this.fruited = false;
        this.famille = Plante.getFamille();
        this.id = utils.generateID();
        this.plantable = true;
        this.died = false;
    }
    /**
     * Variable de classe pour indiquer à quelle groupe d'objet elle pappartient
     */
    static getFamille(){
        return "plante";
    }
    /**
     * Appelé quand la plante est mise en terre pour la première fois
     */
    startLife(){
        this.birth = Date.now();
    }
    /**
     * Méthode appelé sur toutes les cases plantés par l'instance game.
     * Elle update l'état de la plante et voit si cette dernière n'est pas décédé
     * retourne un bouleen pour savoir si la plante est morte ou pas
     */
    grow(){
        this.age = Date.now() - this.birth;
        this.state = Math.floor(this.state/this.speed);
        if (this.state >= 3 && !this.bloomed) {
            this.bloom();
        }
        if(this.state >=5 && !this.fruited){
            this.fruit();
        }
        if(this.state >9){
            this.die();
        }
        return this.died;
    }

    /**
     * Méthode simulant la floraison
     * une plante peut produire aléatoirement en 0 et 3 fleurs
     */
    bloom(){
        this.nbFlowers = Math.floor(Math.random() * 3);
        this.bloomed = true;
    }

    /**
     * Méthode simulant la fructification
     * Le nombre de fruits/graines correspond au nombre de fleurs
     */
    fruit(){
        this.nbSeeds = this.nbFlowers;
        this.nbFlowers = 0;
        this.fruited = true;
    }
    /**
     * Méthode correpsondant à a fin de la vie de la plante
     */
    die(){
        this.died = true;
        this.plantable = false;
    }
    /**
     * Méthode appelé par l'instance game lorsque que le joueur veut récolter les graines
     */
    getSeeds(){
        let seeds = [];
        for (let i = 0; i < this.nbSeeds; i++) {
            seeds.push(PlanteFactory.createPlante(this.name));      
        }
        this.nbSeeds = 0;
        return seeds;
    }

}

module.exports = Plante;