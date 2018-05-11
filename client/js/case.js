/**
 * Case est une classe abstraite jamais instancié, elle représente l'ensemble des parcelles du terrains 
 */
class Case{
    constructor(x,y){
        this.dom = document.createElement("td");
        this.x = x;
        this.y = y;
        this.dom.addEventListener("click",function(){
            player.update(this);
            this.actionsPossibles();
        }.bind(this));
    }
    

    actionsPossibles(){
        let actions = document.getElementById("actions");
        while (actions.firstChild) {
            actions.removeChild(actions.firstChild);
        }
    }
}

/**
 * Classe symbolisant l'ensemble des cases vides qui n'appartiennent à personne
 */
class EmptyCase extends Case{
    constructor(x,y){
        super(x,y);
    }

    actionsPossibles(){
        super.actionsPossibles();
        document.getElementById("actions").appendChild(boutonAcheter);
    }
    
}

/**
 * Classe symoblisant l'ensemble des cases qui ont été achetés par un joueur
 */
class BoughtCase extends Case{
    constructor(x,y,player){
        super(x,y);
        this.player = player;
        this.dom.style.backgroundImage = "url('img/labours.jpg')";
        this.dom.style.border = "3px solid" + this.player.color;
    }

    actionsPossibles(){
        super.actionsPossibles();
        document.getElementById("actions").appendChild(boutonPlanter);
        document.getElementById("actions").appendChild(boutonRecolter);
        document.getElementById("actions").appendChild(boutonFertiliser);

    }
}

class PlantedCase extends BoughtCase{
    constructor(x,y,player, plante){
        super(x,y, player);
        this.plante = plante;
        this.dom.style.backgroundImage = "url(" + this.plante.img +")";
    }

    actionsPossibles(){
        super.actionsPossibles();
        document.getElementById("actions").appendChild(boutonRecolter);
        document.getElementById("actions").appendChild(boutonFertiliser);
    }
}


class CaseFactory{
    static createCase(JSONCase){
        let type = JSONCase.type;
        let x = JSONCase.x;
        let y = JSONCase.y;
        let object;
        let player;
        //console.log(JSONCase);

        switch(type) {
        case 'empty':
            object = new EmptyCase(x,y);
            break;
        case 'bought':
            if(playerManager.checkPlayer(JSONCase.owner.name)){
                player = playerManager.findPlayer(JSONCase.owner.name);
                object = new BoughtCase(x,y,player);
                //console.log(object);
            }
            else{
                //gestion du cas ou le joueur ayant acheté la case n'apparait pas coté client
            }
            break;
        case 'planted':
            if(playerManager.checkPlayer(JSONCase.owner.name)){
                player = playerManager.findPlayer(JSONCase.owner.name);
                let plante = PlanteFactory.createPlante(JSONCase.plante);
                object = new PlantedCase(x,y,player,plante);
            }
            else{
                console.log("gestion du cas ou le joueur ayant acheté la case n'apparait pas coté client");
            }
            break;
        } 
        //console.log(object);
        return object;
    }
}