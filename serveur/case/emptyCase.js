var Case = require("./case.js");
/**
 * La classe des cases vides, les cases vides n'ont aucun propriétaire
 */
class EmptyCase extends Case{
    constructor(x,y){
        super(x,y);
        this.type = 'empty';
    }

    toJSON(){
        let json = Object.assign({}, this);
        return json;
    }
}

module.exports = EmptyCase;