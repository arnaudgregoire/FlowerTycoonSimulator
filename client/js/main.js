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


