class Opponent{
    constructor(name,color){
        this.name  = name;
        this.color = color;
        this.representation = document.createElement("li");
        this.representation.appendChild(document.createTextNode(this.name));
        this.representation.style.color = this.color;
    }
}