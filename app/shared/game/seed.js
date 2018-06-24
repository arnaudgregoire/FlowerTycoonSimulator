(function () {
	"use strict";
	let isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');
	
	var nanoid;
	var PlantSpecies;

	if (isNode) {
		 nanoid = require("nanoid");
		 PlantSpecies = require('./plantSpecies.js').PlantSpecies;
	}
	else {
    PlantSpecies = window.PlantSpecies;
	}
	
	class Seed{
	  constructor(id, name){
			this.id = id;
			this.category = "seed";
			this.name = name;
			this.cost = 10;
		}

	toJson() {
		// return JSON.stringify(this);
		return({"name": this.name, "id": this.id});
	  }
	}
  
	class SeedRose extends Seed {
	  constructor(id) {
		super(id, "rose");
	  }
  
	  getAsset() {
		return ImgLoader.get("seed");
	  }
	}
  
	class SeedTulip extends Seed {
	  constructor(id) {
		super(id, "tulip");
	  }
  
	  getAsset() {
		return ImgLoader.get("seed");
	  }
	}

	class SeedPoppy extends Seed {
	  constructor(id) {
		super(id, "poppy");
	  }
  
	  getAsset() {
		return ImgLoader.get("seed");
	  }
	}

	class SeedIris extends Seed {
	  constructor(id) {
		super(id, "iris");
	  }
  
	  getAsset() {
		return ImgLoader.get("seed");
	  }
	}
  
	// Static class style
	var SeedFactory = {
	  seeds: PlantSpecies.getSpecies()
	};
	SeedFactory.prototype = {
	  createSeed: function (seed_name, id) {
		let seed_id = SeedFactory.seeds.indexOf(seed_name);
		let seed;
		if(seed_id == -1) {
		  return null;
		}
  
		switch(seed_id){
			case 0:
			  seed = new SeedRose(id);
			  break;
  
			case 1:
			  seed = new SeedTulip(id);
				break;
			
			case 2:
				seed = new SeedPoppy(id);
				break;
			
			case 3:
				seed = new SeedIris(id);
				break;
		}
		return seed;
	  },

      createSeedFromData: function(seed_data) {
		let seed = this.createSeed(seed_data.name, seed_data.id);
  
		if(seed == null) {
		  return null;
		}

		return seed;
	  },
  
	  getRandomSeed: function () {
		return this.createSeed(SeedFactory.seeds[Math.floor(Math.random() * SeedFactory.seeds.length)],nanoid());
	  }
	};
  
	// Node export
	if (isNode) {
	  module.exports = {
		Seed: Seed,
		SeedRose: SeedRose,
		SeedTulip: SeedTulip,
		SeedFactory: SeedFactory
	  };
	}
	// Browser export
	else {
	  window.Seed = Seed;
	  window.SeedRose = SeedRose;
	  window.SeedTulip = SeedTulip;
	  window.SeedFactory = SeedFactory;
	}
  })();
  