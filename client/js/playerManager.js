class PlayerManager{
    constructor(){
        this.players = [];
        this.playersHTML = document.createElement('ul');
        document.getElementById("leaderboards").appendChild(this.playersHTML);
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
                    self.players = [];
                    for (let i = 0; i < json.players.length; i++) {
                        self.players.push( new Opponent(json.players[i].name, json.players[i].color, json.players[i].score));
                    }
                    self.showPlayers();
                });
            }} 
        )
    }

    showPlayers(){
        // on retire tous les enfants
        while (this.playersHTML.firstChild) {
            this.playersHTML.removeChild(this.playersHTML.firstChild);
        }
        // pour rajouter les nouveaux
        this.showHeader();
        for (let i = 0; i < this.players.length; i++) {
            this.playersHTML.appendChild(this.players[i].representation);
        }
    }

    showHeader(){
        let element = document.createElement("li");
        let titre = document.createElement("h3").appendChild(document.createTextNode("Joueur, Score"));
        element.appendChild(titre);
        this.playersHTML.appendChild(element);
    }

    checkPlayer(name){
        let exist = false;
        for (let i = 0; i < this.players.length; i++) {
            if(this.players[i].name == name){
                exist = true;
            }
        }
        return exist;
    }

    findPlayer(name){
        let player;
        for (let i = 0; i < this.players.length; i++) {
            if(this.players[i].name == name){
                player = this.players[i];
            }
        }
        return player;
    }
}

