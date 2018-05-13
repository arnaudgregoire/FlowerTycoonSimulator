class Opponent{
    constructor(name,color,score){
        this.name  = name;
        this.color = color;
        this.score = score;
        this.representation = document.createElement("li");
        this.representation.appendChild(document.createTextNode(this.name + ", " + this.score));
        this.representation.style.color = this.color;
    }
}