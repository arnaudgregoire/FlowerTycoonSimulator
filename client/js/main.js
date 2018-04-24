
var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var ctx = canvas.getContext("2d");

document.getElementById('buttonPlanter').addEventListener("click", planter);

function planter() {
    ctx.fillRect(20,20,150,100); 
}

