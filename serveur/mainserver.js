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
  BuyFirstTime(buyer){
    if (IsFree == true){
      this.Owner = buyer;
      this.IsFree = false;
      console.log('BuyFirstTime : '+'case (' + this.CoordX + ','+ this.CoordY + ') bought successfully')
    } else {
      console.log('BuyFirstTime : '+'case (' + this.CoordX + ','+ this.CoordY + ') already belonged to someone')
    }
  }
  Plant(SeedType){
    if(this.Owner != null){
      if(this.IsPLanted = false){
        this.PlantType = SeedType;
        this.IsPLanted = true;
        this.GrowthStep = 0;
      } else {
        console.log('Plant : ' + 'case (' + this.CoordX + ','+ this.CoordY + ') has already something planted')
      }
    } else {
      console.log('Plant : ' + 'case (' + this.CoordX + ','+ this.CoordY + ') has no owner')
    }
  }
  
}