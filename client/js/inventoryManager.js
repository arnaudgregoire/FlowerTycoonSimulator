class InventoryManager{
	constructor(){
		this.money = 0;
		this.inventory = [];
		this.inventoryHTML = document.createElement('ul');
        document.getElementById("inventory").appendChild(this.inventoryHTML);
	}

	getInventory(){
		let self = this;
		send("getInventory",JSON.stringify(
            {
                "fonction": "getInventory",
                'param' : {
                	'login': loginManager.name
                }
            }
        )).then(function(response){
            if(response.ok) {
                response.json().then(function(json) {
                	//console.log(json);
                    self.inventory = [];
                    for (let i = 0; i < json.inventory.length; i++) {
						self.inventory.push(ObjectFactory.createObject(json.inventory[i]));
					}
					self.money = json.money;
                    self.showInventory();
                });
            }} 
        )
	}

	showInventory(){
		// on retire tous les enfants
        while (this.inventoryHTML.firstChild) {
            this.inventoryHTML.removeChild(this.inventoryHTML.firstChild);
        }
        // pour rajouter les nouveaux
		//console.log(this.inventory);
		this.showMoney();
		for (var i = 0; i < this.inventory.length; i++) {
			this.inventoryHTML.appendChild(this.inventory[i].representation);
		}
	}

	showMoney(){
		let moneyHTML = document.createElement("li").appendChild(document.createTextNode("Money : " + this.money));
		this.inventoryHTML.appendChild(moneyHTML);
	}
}

/**
 * DESIGN PATTERN FACTORY \(^.^)/
 * Cette classe sert a generer les differents types d objets (fleurs graines engrais) que l on va implementer 
 */
class ObjectFactory {
	static createObject(objectJSON){

		let famille = objectJSON.famille;
		let object;
		//console.log(objectJSON);

		switch(famille) {
	    case 'seed':
	        object = new Seed(objectJSON.name);
	        break;
	    case 'flower':
	        object = new Flower(objectJSON.name);
	        break;
		case 'plante':
			object = new Plante(objectJSON.name, objectJSON.id);
			break;
		}
		//console.log(object);
		return object;
	}	
}





