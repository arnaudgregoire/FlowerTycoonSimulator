var Tulipe = require("./tulipe.js");
var Rose   = require("./rose.js");
/**
 * Toujours le design pattern factory pour fabriquer de magnifiques plantes
 */
class PlanteFactory{
    static createPlante(nom){
        let plante;
        switch(nom){
            case "tulipe":
                plante = new Tulipe();
                break;
            
            case "rose":
                plante = new Rose();
                break;
        }
        return plante;
    }

    static getRandomPlante(){
        let plantePossible = ["tulipe","rose"];
        let planteChoisie = plantePossible[Math.floor(Math.random()*plantePossible.length)];
        return PlanteFactory.createPlante(planteChoisie);
    }
}

module.exports = PlanteFactory;