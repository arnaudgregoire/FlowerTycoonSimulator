const express = require('express')
var cors = require('cors')
const bodyParser = require("body-parser");

const app = express()

app.use(cors())
app.use(bodyParser.json());

app.post('/planter', function (req, res) {
  console.log(req.body);
  let fonction = req.body.fonction;
  console.log(fonction);
  res.json({"reponse": 1})
})

app.post('/acheter', function (req, res) {
  console.log(req.body);
  let fonction = req.body.fonction;
  console.log(fonction);
  res.json({"reponse": 1})
})

app.post('/login', function (req, res) {
  console.log(req.body);
  let fonction = req.body.fonction;
  console.log(fonction);
  res.json({"reponse": 1})
})

app.post('/getPlayers', function (req, res) {
  console.log(req.body);
  let fonction = req.body.fonction;
  console.log(fonction);
  res.json({"players": [
    {name : "Amaury", color : "blue"},
    {name : "Ogus", color : "red"}
  ]})
})

app.post('/getInventory', function (req, res) {
  console.log(req.body);
  let fonction = req.body.fonction;
  console.log(fonction);
  res.json({"inventory": [
    {type : "seed", name : "Graine de tulipe"},
    {type : "flower", name : "Fleur de tournesol"}
  ]})
})


app.listen(8081, function () {
  console.log('listening on port 8081!');
})

class CaseServer{
  constructor(CoordX, CoordY){ // coordonnées relatives : 1ere case (0,0) 2eme case (0,1), etc...
    this.CoordX = CoordX;
    this.CoordY = CoordY;
    this.IsFree = true;
    this.Owner = null;
    this.PlantType = null;
    this.IsPlanted = false;
    this.GrowthStep = -1;
    this.HarvestPossible = false;
  }

  //methode pour acheter une case
  //conditions : la case doit etre libre
  BuyFirstTime(buyer){
    if (IsFree != true){
      console.log('BuyFirstTime : '+'case (' + this.CoordX + ','+ this.CoordY + ') already belonged to someone')
    } else {
      this.Owner = buyer;
      this.IsFree = false;
      console.log('BuyFirstTime : '+'case (' + this.CoordX + ','+ this.CoordY + ') bought successfully')
    }
  }

  // methode pour planter une graine 
  // conditions : la case doit etre vendue et rien ne doit etre planté dessus
  Plant(SeedType){ 
    if(this.Owner = null){
      console.log('Plant : ' + 'case (' + this.CoordX + ','+ this.CoordY + ') has no owner')
    } else {
      if(this.IsPLanted = false){
        console.log('Plant : ' + 'case (' + this.CoordX + ','+ this.CoordY + ') has already something planted')
      } else {
        this.PlantType = SeedType;
        this.IsPLanted = true;
        this.GrowthStep = 0;
        console.log('Plant : ' + 'case (' + this.CoordX + ','+ this.CoordY + ') sucessfully planted')
      }
    }
  }
  
}


class Seed{
  constructor(seedType,timeToGrow){
    this.SeedType = seedType; //type de graine
    this.TimeToGrow = timeToGrow; //temps qu'il faut pour que ca pousse ( ca dépend du type je suppose )
    //Peut etre ajouter d'autres attributs
  }
  //TODO methode pour faire pousser les graines ( ou alors le faire dans la classe CASE )
}

class Player{
  constructor(){
    //TODO
  }
}