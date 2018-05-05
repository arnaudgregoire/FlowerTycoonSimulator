var Case = require("./case.js");
/**
 * La classe des cases vides, les cases vides n'ont aucun propriétaire
 */
class EmptyCase extends Case{
    constructor(x,y){
        super(x,y);
    }

    toJSON(){
        return {
            "type" : "EmptyCase",
            "attributs" : {
                "x" : this.x,
                "y" : this.y
            }
        }
    }
}

module.exports = EmptyCase;