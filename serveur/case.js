class Case{
	constructor(x,y){
        this.x = x;
        this.y = y;
    }
    
    toJSON(){
        return JSON.stringify(this);
    }
}

class EmptyCase extends Case{
    constructor(x,y){
        super(x,y);
    }

    toJSON(){
        super.toJSON();
    }
}

class BoughtCase extends Case{
    constructor(x,y,player){
        super(x,y);
        this.owner = player;
    }

    toJSON(){
        super.toJSON();
    }
}

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
module.exports = Case, EmptyCase, BoughtCase, PlantedCase;