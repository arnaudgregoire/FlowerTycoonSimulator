function send(task,data) {
    return fetch("http://localhost:8081/"+task,{
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: data  
    })
}



let terrain = new Terrain(5,10);
let player = new Player();

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

let boutonFertiliser = document.createElement("button");
boutonFertiliser.classList.add("button");
boutonFertiliser.id = "buttonFertiliser";
boutonFertiliser.appendChild(document.createTextNode("Acheter"));

