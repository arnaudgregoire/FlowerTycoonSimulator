(function () {
    "use strict";
    let isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');
    var PlantSpecies;
    var PlantFactory;

    if (isNode){
        PlantSpecies = require("./plantSpecies").PlantSpecies;
        PlantFactory = require("./plant.js").PlantFactory;
    }

    else{
        PlantSpecies = window.PlantSpecies;
        PlantFactory = window.PlantFactory;
    }

    class Bouquet{
        constructor(arrayFlower){
            this.arrayFlower = arrayFlower;
        }

        isValid(bouquets){
            let valid = false;
            for (let i = 0; i < bouquets.length; i++) {
                let testValid = true;
                for (let j = 0; j < bouquets[i].arrayFlower.length; j++) {
                    if(bouquets[i].arrayFlower[j].name != this.arrayFlower[j].name && bouquets[i].arrayFlower[j].bloomed){
                        testValid = false;
                    }
                }
                if (testValid) {
                    valid = true;
                }
            }
            return valid;
        }

        static getRandomBouqet(){
            return new Bouquet([
                PlantFactory.prototype.createPlantFromData({"name":PlantSpecies.getRandomSpecies(), "state":200000}),
                PlantFactory.prototype.createPlantFromData({"name":PlantSpecies.getRandomSpecies(), "state":200000}),
                PlantFactory.prototype.createPlantFromData({"name":PlantSpecies.getRandomSpecies(), "state":200000}),
                PlantFactory.prototype.createPlantFromData({"name":PlantSpecies.getRandomSpecies(), "state":200000})
            ]);
        }
    }

	// Node export
	if (isNode) {
	  module.exports = {
        Bouquet: Bouquet
	  };
	}
	// Browser export
	else {
	  window.Bouquet = Bouquet;
	}    

  })();
  