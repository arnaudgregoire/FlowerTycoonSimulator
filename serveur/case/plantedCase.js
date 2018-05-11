var BoughtCase = require("./boughtCase.js");
/**
 * La classe des cases plantés. Les cases plantés ont à la fois un propriétaire et un végétal plantés sur leurs surfaces.
 * Le végétal peut être une graine ou une plante
 */
class PlantedCase extends BoughtCase{
    constructor(x,y,player,plante){
        super(x,y,player);
        this.plante = plante;
        this.type = PlantedCase.getType();
    }
    toJSON(){
        let json = Object.assign({}, this);
        return json;
    }

    //variables de classes
    static getType(){
        return "planted";
    }
}

module.exports = PlantedCase;