var utils = require("../utils.js");

class Plante{
    constructor(){
        this.age = 0;
        this.name = "";
        this.state = 0;
        this.famille = Plante.getFamille();
        this.id = utils.generateID();
        this.plantable = true;
    }

    static getFamille(){
        return "plante";
    }
}

module.exports = Plante;