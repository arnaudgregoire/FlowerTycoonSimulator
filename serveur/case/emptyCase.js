var Case = require("./case.js");
/**
 * La classe des cases vides, les cases vides n'ont aucun propriétaire
 */
class EmptyCase extends Case{
    constructor(x,y){
        super(x,y);
        this.type = EmptyCase.getType();
        this.cost = EmptyCase.getCost();
    }

    toJSON(){
        let json = Object.assign({}, this);
        return json;
    }

    //variables de classes
    static getCost(){
        return 10;
    }

    static getType(){
        return "empty";
    }
}

module.exports = EmptyCase;