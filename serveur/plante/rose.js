var Plante = require("./plante.js");

class Rose extends Plante{
    constructor(){
        super();
        this.name = Rose.getName();
    }

    static getName(){
        return "rose";
    }
    
    toJSON(){
        let json = Object.assign({}, this);
        return json;
    }
}

module.exports = Rose;