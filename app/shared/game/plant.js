(function () {
  "use strict";
  let isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');

  if (isNode) {
    var nanoid = require("nanoid");
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
      this.nbPlants = 0;
      this.nbSeeds = 0;
      this.bloomed = false;
      this.fruited = false;
      this.plantable = true;
      this.died = false;
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
      if(this.state >= 5000 && !this.fruited){
        this.fruit();
      }
      if(this.state > 9000){
        this.die();
      }
      return this.died;
    }
    /**
    * Méthode simulant la floraison
    * une plante peut produire aléatoirement en 1 et 3 fleurs
    */
    bloom(){
      this.nbPlants = 1 + Math.floor(Math.random() * 2);
      this.bloomed = true;
    }
    /**
    * Méthode simulant la fructification
    * Le nombre de fruits/graines correspond au nombre de fleurs
    */
    fruit(){
      this.nbSeeds = this.nbPlants;
      this.nbPlants = 0;
      this.fruited = true;
    }
    /**
    * Méthode correpsondant à a fin de la vie de la plante
    */
    die(){
      this.died = true;
      this.plantable = false;
    }
    /**
    * Méthode appelé par l'instance game lorsque que le joueur veut récolter les graines
    */
    getSeeds(){
      let seeds = [];
      for (let i = 0; i < this.nbSeeds; i++) {
        seeds.push(PlantFactory.createPlant(this.name));
      }
      this.nbSeeds = 0;
      return seeds;
    }
  }

  class Rose extends Plant {
    constructor(id) {
      super(id, "rose");
      this.speed = 1;
      this.assetPath = "public/assets/Plant/rose.png";
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
      else if(this.state < 5000) {
        return ImgLoader.get("rose");
      }
      else{
        // maybe this should change for another asset
        return ImgLoader.get("rose");
      }
    }
  }

  class Tulip extends Plant {
    constructor(id) {
      super(id, "tulip");
      this.speed = 1.5;
      this.assetPath = "public/assets/Plant/tulip.png";
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
      else if(this.state < 5000) {
        return ImgLoader.get("tulip");
      }
      else{
        // maybe this should change for another asset
        return ImgLoader.get("tulip");
      }
    }
  }

  // Static class style
  var PlantFactory = {
    PlantS: ["rose", "tulip"]
  };
  PlantFactory.prototype = {
    createPlant: function (Plant_name, id) {
      let Plant_id = PlantFactory.PlantS.indexOf(Plant_name);
      let Plant;
      if(Plant_id == -1) {
        return null;
      }

      switch(Plant_id){
          case 0:
            Plant = new Rose(id);
            break;

          case 1:
            Plant = new Tulip(id);
            break;
      }
      return Plant;
    },

    createPlantFromData: function(Plant_data) {
      let Plant = this.createPlant(Plant_data.name, Plant_data.id);

      if(Plant == null) {
        return null;
      }

      Plant.age = Plant_data.age;
      Plant.state = Plant_data.state;
  		return Plant;
    },

    getRandomPlant: function () {
      return this.createPlant(PlantFactory.PlantS[Math.floor(Math.random() * PlantFactory.PlantS.length)],nanoid());
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
