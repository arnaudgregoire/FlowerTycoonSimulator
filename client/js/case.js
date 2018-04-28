class Case{
    constructor(x,y){
        this.dom = document.createElement("td");
        this.x = x;
        this.y = y;
        this.dom.addEventListener("click",function(){
            player.update(this);
            this.dom.style.background = "green";
        }.bind(this));
    }
    plante(){
        this.dom.style.background = "brown";
    }
} 