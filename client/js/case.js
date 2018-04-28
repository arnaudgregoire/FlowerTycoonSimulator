class Case{
    constructor(x,y){
        this.dom = document.createElement("td");
        this.x = x;
        this.y = y;
        this.dom.addEventListener("click",function(){
            player.update(x,y);
            this.style.background = "green";
        });
    }
    plante(){
        this.dom.style.background = "brown";
    }
} 