(function () {
    "use strict";
    let isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');
    var PlantSpecies;

    if (isNode){
        PlantSpecies = require("./plantSpecies");
    }

    else{
        PlantSpecies = window.PlantSpecies;
    }

    class Bouquet{
        constructor(arrayFlower){
            this.arrayFlower = arrayFlower;
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
  