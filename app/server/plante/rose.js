var Plante = require("./plante.js");

/**
 * Categorie de plante réeelement instancié
 */
class Rose extends Plante{
    constructor(){
        super();
        this.name = Rose.getName();
        this.speed = Rose.getSpeed();
    }

    static getName(){
        return "rose";
    }
    
    static getSpeed(){
        return 1;
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

module.exports = Rose;