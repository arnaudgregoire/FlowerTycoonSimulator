


class Terrain{
    constructor(nbHauteur, nbLargeur){
        this.nbHauteur = nbHauteur;
        this.nbLargeur = nbLargeur;
        this.cases = new Array(nbHauteur);
        // Initialisation de la matrice contenant les cases
        for (var i = 0; i < nbHauteur; i++) {
            this.cases[i] = new Array(nbLargeur);
        }
        this.createTable();
        this.update();
    }
    createTable(){
        for (let i = 0; i < this.nbHauteur; i++) {
            let ligne = document.createElement("tr");
            for (let j = 0; j < this.nbLargeur; j++) {
                this.cases[i,j] = new Case(i,j);
                ligne.appendChild(this.cases[i,j].dom);
            }
        document.getElementById("map").appendChild(ligne);
        }
    }
    update(){

    }
}

class Case{
    constructor(x,y){
        this.dom = document.createElement("td");
        this.x = x;
        this.y = y;
        this.dom.addEventListener("click",function(){
            player.update(x,y);
            this.style.background = "green";
        });
    }
    plante(){
        this.dom.style.background = "red";
    }
} 

class Player{
    constructor(){
        this.selectedX = 0;
        this.selectedY = 0;
    }
    update(x,y){
        console.log(x,y);
        this.selectedX = x;
        this.selectedY = y;
    }
    planter() {
        send("planter",JSON.stringify(
            {
                "fonction": "planter",
                "param": {
                    "x": player.selectedX,
                    "y": player.selectedY
                }
            }
        )).then(function(response){
            if(response.ok) {
                response.json().then(function(json) {
                    console.log(json);
                    if(json.reponse == 1){
                        console.log(player.selectedX,player.selectedY);
                        terrain.cases[player.selectedX,player.selectedY].plante();
                    }
                });
            }} 
        )
    }
}

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
document.getElementById('buttonPlanter').addEventListener("click", player.planter);


