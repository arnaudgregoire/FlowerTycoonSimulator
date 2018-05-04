class PlayerManager{
    constructor(){
        this.listPlayers = [];
        this.listPlayersHTML = document.createElement('ul');
        document.getElementById("leaderboards").appendChild(this.listPlayersHTML);
        this.getPlayers();
    }

    getPlayers(){
        let self = this;
        send("getPlayers",JSON.stringify(
            {
                "fonction": "getPlayers"
            }
        )).then(function(response){
            if(response.ok) {
                response.json().then(function(json) {
                    self.listPlayers = [];
                    for (let i = 0; i < json.players.length; i++) {
                        self.listPlayers.push( new Personne(json.players[i].name, json.players[i].color));
                    }
                    self.showPlayers();
                });
            }} 
        )
    }

    showPlayers(){
        // on retire tous les enfants
        while (this.listPlayersHTML.firstChild) {
            this.listPlayersHTML.removeChild(this.listPlayersHTML.firstChild);
        }
        // pour rajouter les nouveaux
        for (let i = 0; i < this.listPlayers.length; i++) {
            this.listPlayersHTML.appendChild(this.listPlayers[i].representation);
        }
    }
}

class Personne{
    constructor(name,color){
        this.name  = name;
        this.color = color;
        this.representation = document.createElement("li");
        this.representation.appendChild(document.createTextNode(this.name));
        this.representation.style.color = this.color;
    }
}