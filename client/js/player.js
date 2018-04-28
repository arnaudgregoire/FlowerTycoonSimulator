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
                        terrain.cases[player.selectedX][player.selectedY].plante();
                    }
                });
            }} 
        )
    }
}