class Case{
    constructor(x,y){
        this.dom = document.createElement("td");
        this.x = x;
        this.y = y;
    }
    plante(){
        this.dom.style.background = "brown";
    }
    
    actionsPossibles(){
        let actions = document.getElementById("actions");
        while (actions.firstChild) {
            actions.removeChild(actions.firstChild);
        }
    }
}

class EmptyCase extends Case{
    constructor(x,y){
        super(x,y);
        this.dom.addEventListener("click",function(){
            player.update(this);
            this.actionsPossibles();
        }.bind(this));
    }

    actionsPossibles(){
        super.actionsPossibles();
        document.getElementById("actions").appendChild(boutonPlanter);
    }
    
}