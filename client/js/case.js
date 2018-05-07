/**
 * Case est une classe abstraite jamais instancié, elle représente l'ensemble des parcelles du terrains 
 */
class Case{
    constructor(x,y){
        this.dom = document.createElement("td");
        this.x = x;
        this.y = y;
        this.dom.addEventListener("click",function(){
            if(player.selectedCase != 0){
                player.selectedCase.dom.style.border = "";
            }
            player.update(this);
            this.dom.style.border = "1px solid red";
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
    constructor(x,y){
        super(x,y);
        this.dom.style.backgroundImage = "url('img/labours.jpg')";
    }

    actionsPossibles(){
        super.actionsPossibles();
        document.getElementById("actions").appendChild(boutonPlanter);
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
        //console.log(type);

        switch(type) {
        case 'empty':
            object = new EmptyCase(x,y);
            break;
        case 'bought':
            object = new BoughtCase(x,y);
            break;
        }
        //console.log(object);
        return object;
    }
}