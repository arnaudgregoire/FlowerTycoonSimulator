
var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var ctx = canvas.getContext("2d");

document.getElementById('buttonPlanter').addEventListener("click", planter);


class Terrain{
    constructor(nbHauteur, nbLargeur){
        this.nbHauteur = nbHauteur;
        this.nbLargeur = nbLargeur;
        this.drawlines();
        this.update();
    }
    drawlines(){
        for (let x = 0; x < this.nbHauteur; x++) {
            ctx.beginPath();
            ctx.moveTo(x*canvas.width/this.nbHauteur,0);
            ctx.lineTo(x*canvas.width/this.nbHauteur,canvas.height);
            ctx.stroke();
            ctx.closePath();
        }
    }
    update(){

    }
}

let test = new Terrain(10,10);

function send(data) {
    return fetch("http://localhost:8080/",{
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: data  
    })
}

function planter(x,y) {
    send(JSON.stringify(
        {
            "fonction": "planter",
            "param": {
                "x": x,
                "y": y
            }
        }
    )).then(function(response){
        if(response.ok) {
            response.json().then(function(json) {
                console.log(json);
                if(json.reponse == 1){
                    ctx.fillRect(x,y,100,100); 
                }
            });
        }} 
    )
}

