class Plante{
	constructor(name,id,age,state){
		this.representation = document.createElement("li");
		this.representation.style.border = "1px solid black";
		this.representation.style.padding = "5px";
		let self = this;
		this.representation.addEventListener('click', function(){player.updateObject(self)});
		this.name = name;
		this.age   = age;
		this.state = state;
		this.id = id;
		this.famille = Plante.getFamille();
        this.representation.appendChild(document.createTextNode(this.name));
	}

	toJSON(){
		return({"name": this.name, "age": this.age, "state": this.state, "id": this.id});
	}

	static getFamille(){
		return("plante");
	}
}

class Rose extends Plante{
	constructor(name,id,age,state){
		super(name,id,age,state);
		this.img = "img/rose.jpg";
	}
}

class Tulipe extends Plante{
	constructor(name,id,age,state){
		super(name,id,age,state);
		this.img = "img/tulipe.jpg";
	}
}

class PlanteFactory{
	static createPlante(planteJSON){
		//console.log(planteJSON);
		let plante;
		let name = planteJSON.name;
		let id = planteJSON.id;
		let age = planteJSON.age;
		let state = planteJSON.state;
		switch(name){
			case "tulipe":
				plante = new Tulipe(name,id,age, state);
				break;

			case "rose":
				plante = new Rose(name,id,age, state);
				break;
		}
		return plante;
	}
}
