var Plante = require("./plante.js");

class Tulipe extends Plante{
    constructor(){
        super();
        this.name = Tulipe.getName();
    }

    static getName(){
        return "tulipe";
    }
   
    toJSON(){
        let json = Object.assign({}, this);
        return json;
    }
}

module.exports = Tulipe;