
var canvas = document.getElementById('canvas');
canvas.width = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) /2;
canvas.height = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) /2;
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
        for (let y = 0; y < this.nbLargeur; y++) {
            ctx.beginPath();
            ctx.moveTo(0,y*canvas.height/this.nbLargeur);
            ctx.lineTo(canvas.width,y*canvas.height/this.nbLargeur);
            ctx.stroke();
            ctx.closePath();
        }
    }
    update(){

    }
}

class Player{
    constructor(){
        this.mouseX = 0;
        this.mouseY = 0;
    }
    update(e){
        let pos = getMousePos(canvas, e);
        this.mouseX = pos.x;
        this.mouseY = pos.y;
        console.log(this.mouseX);
        console.log(this.mouseY);
    }
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function send(task,data) {
    return fetch("http://localhost:8080/"+task,{
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: data  
    })
}

function planter(x,y) {
    send("planter",JSON.stringify(
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

let terrain = new Terrain(10,10);
let player = new Player();
document.getElementById("canvas").addEventListener("click",player.update);