(function () {
  "use strict";
  let isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');

  class Flower{
    constructor(id, name){
      this.id = id;
      this.category = "plant";
      this.name = name;

      this.speed = 0;
      this.birth = 0;
      this.age = 0;
      this.state = 0;
      this.nbFlowers = 0;
      this.nbSeeds = 0;
      this.bloomed = false;
      this.fruited = false;
      this.plantable = true;
      this.died = false;
    }

    update(dt) {
      this.grow(dt);
    }

    draw(ctx) {

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
      this.nbFlowers = 1 + Math.floor(Math.random() * 2);
      this.bloomed = true;
    }
    /**
    * Méthode simulant la fructification
    * Le nombre de fruits/graines correspond au nombre de fleurs
    */
    fruit(){
      this.nbSeeds = this.nbFlowers;
      this.nbFlowers = 0;
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
        seeds.push(FlowerFactory.createFlower(this.name));
      }
      this.nbSeeds = 0;
      return seeds;
    }
  }

  class Rose extends Flower {
    constructor(id) {
      super(id, "rose");
      this.speed = 1;
    }
  }

  class Tulip extends Flower {
    constructor(id) {
      super(id, "tulip");
      this.speed = 1.5;
    }
  }

  // Static class style
  var FlowerFactory = {
    FLOWERS: ["rose", "tulip"]
  };
  FlowerFactory.prototype = {
    createFlower: function (flower_name) {
      let flower_id = this.FLOWERS.indexOf(flower_name);

      if(flower_id == -1) {
        return null;
      }

      switch(flower_id){
          case 0:
            flower = new Rose();
            break;

          case 1:
            flower = new Tulip();
            break;
      }
      return flower;
    },

    createFlowerFromData: function(flower_data) {
      let flower = this.createFlower(flower_data.name);

      if(flower == null) {
        return null;
      }

      flower.id = flower_data.id;
      flower.age = flower_data.age;
      flower.state = flower_data.state;
  		return flower;
    },

    getRandomFlower: function () {
      return this.createFlower(this.FLOWERS[Math.floor(Math.random() * this.FLOWERS.length)]);
    }
  };

  // Node export
  if (isNode) {
    module.exports = {
      Flower: Flower,
      Rose: Rose,
      Tulip: Tulip,
      FlowerFactory: FlowerFactory
    };
  }
  // Browser export
  else {
    window.Flower = Flower;
    window.Rose = Rose;
    window.Tulip = Tulip;
    window.FlowerFactory = FlowerFactory;
  }
})();
