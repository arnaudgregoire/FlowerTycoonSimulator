(function () {
  "use strict";
  let isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');

  var nanoid;
  var SeedFactory;
  var PlantSpecies;

  if (isNode) {
    nanoid = require("nanoid");
    SeedFactory = require('./seed.js').SeedFactory;
    PlantSpecies = require('./plantSpecies.js').PlantSpecies;
  }
  else{
    PlantSpecies = window.PlantSpecies;
    SeedFactory = window.SeedFactory;
  }
  class Plant{
    constructor(id, name){
      this.id = id;
      this.category = "plant";
      this.name = name;

      this.speed = 0;
      this.birth = 0;
      this.age = 0;
      this.state = 0;
      this.nbSeeds = 0;
      this.bloomed = false;
      this.plantable = true;
      this.died = false;
    }

    static getSpecies(){
      return ["rose", "tulip"]
    }

    update(dt) {
      this.grow(dt);
    }

    draw(ctx, x, y) {
      //
    }

    toJson() {
      // return JSON.stringify(this);
      return({"name": this.name, "age": this.age, "state": this.state, "id": this.id});
    }

    /**
    * Appelé quand la plante est mise en terre pour la première fois
    */
    startLife(){
      // this.birth = Date.now();
      this.birth = 0;
    }
    /**
    * Méthode appelé sur toutes les cases plantés par l'instance game.
    * Elle update l'état de la plante et voit si cette dernière n'est pas décédé
    * retourne un bouleen pour savoir si la plante est morte ou pas
    */
    grow(dt){
      // this.age = Date.now() - this.birth;
      this.age += dt;
      this.state = Math.floor(this.age/this.speed);
      if (this.state >= 3000 && !this.bloomed) {
        this.bloom();
      }
      if(this.state > 9000){
        this.die();
      }
    }
    /**
    * Méthode simulant la floraison
    * une plante peut produire aléatoirement en 1 et 3 fleurs
    */
    bloom(){
      console.log("bloom");
      this.bloomed = true;
    }
    /**
    * Méthode correpsondant à a fin de la vie de la plante
    */
    die(){
      this.nbSeeds = 1 + Math.floor(Math.random() * 2);
      this.died = true;
      this.plantable = false;
    }
    /**
    * Méthode appelé par l'instance game lorsque que le joueur veut récolter les graines
    */
    getSeeds(){
      let seeds = [];
      for (let i = 0; i < this.nbSeeds; i++) {
        seeds.push(SeedFactory.prototype.createSeed(this.name, nanoid()));
      }
      this.nbSeeds = 0;
      return seeds;
    }
  }

  class Rose extends Plant {
    constructor(id) {
      super(id, "rose");
      this.speed = 1;
    }

    // draw(ctx, x, y) {
    //   ctx.fillStyle = "#fe6150";
    //   ctx.arc(x,y, 15, 0, 2*Math.PI, false);
    //   ctx.fill();
    // }
    getAsset() {
      if(this.state < 3000) {
        return ImgLoader.get("plant");
      }
      else if(this.state < 9000) {
        return ImgLoader.get("rose");
      }
      else {
        // maybe this should change for another asset
        return ImgLoader.get("plantOld");
      }
    }
  }

  class Tulip extends Plant {
    constructor(id) {
      super(id, "tulip");
      this.speed = 1.5;
    }

    // draw(ctx, x, y) {
    //   ctx.fillStyle = "#ff8230";
    //   ctx.arc(x,y, 15, 0, 2*Math.PI, false);
    //   ctx.fill();
    // }
    getAsset() {
      if(this.state < 3000) {
        return ImgLoader.get("plant");
      }
      else if(this.state < 9000) {
        return ImgLoader.get("tulip");
      }
      else{
        // maybe this should change for another asset
        return ImgLoader.get("plantOld");
      }
    }
  }

  // Static class style
  var PlantFactory = {
    plants: PlantSpecies.getSpecies()
  };
  PlantFactory.prototype = {
    createPlant: function (plant_name, id) {
      let plant_id = PlantFactory.plants.indexOf(plant_name);
      let plant;
      if(plant_id == -1) {
        return null;
      }

      switch(plant_id){
          case 0:
            plant = new Rose(id);
            break;

          case 1:
            plant = new Tulip(id);
            break;
      }
      return plant;
    },

    createPlantFromData: function(plant_data) {
      let plant = this.createPlant(plant_data.name, plant_data.id);

      if(plant == null) {
        return null;
      }

      plant.age = plant_data.age;
      plant.state = plant_data.state;
      plant.bloomed = plant_data.bloomed;
      plant.nbSeeds = plant_data.nbSeeds;
  		return plant;
    },

    getRandomPlant: function () {
      return this.createPlant(PlantFactory.plants[Math.floor(Math.random() * PlantFactory.plants.length)],nanoid());
    }
  };

  // Node export
  if (isNode) {
    module.exports = {
      Plant: Plant,
      Rose: Rose,
      Tulip: Tulip,
      PlantFactory: PlantFactory
    };
  }
  // Browser export
  else {
    window.Plant = Plant;
    window.Rose = Rose;
    window.Tulip = Tulip;
    window.PlantFactory = PlantFactory;
  }
})();
