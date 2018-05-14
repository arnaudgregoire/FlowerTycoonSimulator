var address = "localhost:8081/";
//flowertycoonsimulator.herokuapp.com/
//localhost:8081/

let player           = new Player();
let loginManager     = new LoginManager();
let inventoryManager = new InventoryManager();
let playerManager    = new PlayerManager();
let terrain          = new Terrain();
var exampleSocket    = new WebSocket("ws://" + address); //wss for heroku
let informationManager = new InformationManager();


function send(task,data) {
    return fetch("http://" + address + task,{ // https for heroku
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: data  
    }).then(
    (response) =>{
            if(response.ok){
                return response.json();
            }
        }
    ).then(
        (json)=>{
            if(typeof json.description != "undefined"){
                informationManager.display(json.description);
            }
            return json;
        }
    )
}

exampleSocket.onopen = function (event) {
    exampleSocket.send("Voici un texte que le serveur attend de recevoir dès que possible !"); 
  };

exampleSocket.onmessage = function (event) {
    let json = JSON.parse(event.data);
    //console.log(json);
    if (json.reponse == "update") {
        terrain.getTerrain();
        playerManager.getPlayers();
    }
}


let boutonPlanter = document.createElement("button");
boutonPlanter.classList.add("button");
boutonPlanter.id = "buttonPlanter";
boutonPlanter.appendChild(document.createTextNode("Planter"));
boutonPlanter.addEventListener("click", function(){player.planter(player)})

let boutonRecolter = document.createElement("button");
boutonRecolter.classList.add("button");
boutonRecolter.id = "buttonRecolter";
boutonRecolter.appendChild(document.createTextNode("Recolter"));

let boutonAcheter = document.createElement("button");
boutonAcheter.classList.add("button");
boutonAcheter.id = "buttonAcheter";
boutonAcheter.appendChild(document.createTextNode("Acheter"));
boutonAcheter.addEventListener("click", function(){player.acheter(player)})

let boutonFertiliser = document.createElement("button");
boutonFertiliser.classList.add("button");
boutonFertiliser.id = "buttonFertiliser";
boutonFertiliser.appendChild(document.createTextNode("Fertiliser"));



