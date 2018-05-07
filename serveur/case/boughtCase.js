var Case = require("./case.js");
/**
 * La classe des cases achetés. Les cases achetés représente l'ensemble des cases qui ont un propriétaire mais qui n'ont
 * rien de planter sur la case en question.
 */
class BoughtCase extends Case{
    constructor(x,y,player){
        super(x,y);
        this.owner = player;
        this.type = BoughtCase.getType();
    }

    toJSON(){
        let json = Object.assign({}, this);
        return json;
    }

    //variables de classes
    static getType(){
        return "bought";
    }
}

module.exports = BoughtCase;