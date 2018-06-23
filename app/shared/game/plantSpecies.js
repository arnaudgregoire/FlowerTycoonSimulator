(function () {
    "use strict";
    let isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');

    class PlantSpecies{
  
      static getSpecies(){
        return ["rose", "tulip", "poppy", "iris"]
      }

      static getRandomSpecies(){
        let species = this.getSpecies();
        return species[Math.floor(Math.random() * species.length)];
      }
    }

	// Node export
	if (isNode) {
	  module.exports = {
    PlantSpecies: PlantSpecies
	  };
	}
	// Browser export
	else {
	  window.PlantSpecies = PlantSpecies;
	}    

  })();
  