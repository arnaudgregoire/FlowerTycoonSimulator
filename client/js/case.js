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
    
    achat(){
        let bought =  new BoughtCase(player.selectedCase.x,player.selectedCase.y);
        terrain.cases[player.selectedCase.x][player.selectedCase.y] = bought;
        this.dom.parentElement.replaceChild(bought.dom,this.dom);
        bought.actionsPossibles();
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