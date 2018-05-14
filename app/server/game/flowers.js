(function () {
  "use strict";
  let isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');

  class Flower{
    constructor(id){
      this.id = id;
      this.category = "plant";

      this.speed = 0;
      this.name = "";
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


    toJson() {
      return JSON.stringify(this);
    }

    /**
    * Appelé quand la plante est mise en terre pour la première fois
    */
    startLife(){
      this.birth = Date.now();
    }
    /**
    * Méthode appelé sur toutes les cases plantés par l'instance game.
    * Elle update l'état de la plante et voit si cette dernière n'est pas décédé
    * retourne un bouleen pour savoir si la plante est morte ou pas
    */
    grow(){
      this.age = Date.now() - this.birth;
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
    * une plante peut produire aléatoirement en 0 et 3 fleurs
    */
    bloom(){
      this.nbFlowers = Math.floor(Math.random() * 3);
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
      super(id);
      this.name = "rose";
      this.speed = 1;
    }
  }

  class Tulip extends Flower {
    constructor(id) {
      super(id);
      this.name = "tulip";
      this.speed = 1.5;
    }
  }

  var FlowerFactory = {
    this.FLOWERS = ["rose", "tulip"];

    this.createFlower = function (flower_name) {
      let flower = null;
      switch(flower_name){
          case "rose":
              flower = new Rose();
              break;

          case "tulip":
              flower = new Tulip();
              break;
      }
      return flower;
    }

    this.getRandomFlower = function () {
      return this.createFlower(this.FLOWERS[Math.floor(Math.random() * this.FLOWERS.length)]);
    }
  }

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
