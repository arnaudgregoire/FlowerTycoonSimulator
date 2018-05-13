var Plante = require("./plante.js");

/**
 * Categorie de plante réeelement instancié
 */
class Tulipe extends Plante{
    constructor(){
        super();
        this.name = Tulipe.getName();
        this.speed = Tulipe.getSpeed();
    }

    static getName(){
        return "tulipe";
    }

    static getSpeed(){
        return 1.5;
    }
   
    toJSON(){
        let json = Object.assign({}, this);
        return json;
    }

    startLife(){
        super.startLife();
    }

    grow(){
        super.grow();
    }

    bloom(){
        super.bloom();
    }

    fruit(){
        super.fruit();
    }

    die(){
        super.die();
    }
    
    getSeeds(){
        super.getSeeds();
    }
}

module.exports = Tulipe;