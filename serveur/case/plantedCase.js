var BoughtCase = require("./boughtCase.js");
/**
 * La classe des cases plantés. Les cases plantés ont à la fois un propriétaire et un végétal plantés sur leurs surfaces.
 * Le végétal peut être une graine ou une plante
 */
class PlantedCase extends BoughtCase{
    constructor(x,y,player,vegetal){
        super(x,y,player);
        this.vegetal = vegetal;
    }
    toJSON(){
        let json = Object.assign({}, this);
        json.vegetal = JSON.stringify(this.vegetal);
        return json;
    }
}

module.exports = PlantedCase;