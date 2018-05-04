class Seed{
	constructor(name){
		this.representation = document.createElement("li");
		this.name = name;
        this.representation.appendChild(document.createTextNode(this.name));
	}
}