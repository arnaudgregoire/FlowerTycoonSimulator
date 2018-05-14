
class LoginManager{
    constructor(){
        this.login = document.getElementById('login');
        this.input = document.createElement("input");
        this.input.type = "text";
        this.submit = document.createElement("button");
        this.submit.appendChild(document.createTextNode("Login"));
        let self = this;
        this.submit.addEventListener("click",function(){self.tryLogin()});
        this.login.appendChild(this.input);
        this.login.appendChild(this.submit);
        this.name = '';

    }

    /**
     * Lance une demande de connection cote client
     */
    tryLogin(){
        let self = this;
        this.name = this.input.value;
        if(this.name == ""){
            informationManager.display("Le login est vide, choisissez un pseudo");
        }
        else{
            //console.log(this.name);
            send("login",JSON.stringify(
                {
                    "fonction": "login",
                    "param": {
                        "login": this.name
                    }
                }
            )).then(function(json){
                    if(json.reponse == 1){
                        self.correctLogin();
                    }
                }
            )
        }
    }

    /**
     * Methode appele lorsque le serveur a repondu positivement a la demande du client
     */
    correctLogin(){
        while (this.login.firstChild) {
            this.login.removeChild(this.login.firstChild);
        }
        let nomHTML = document.createElement("h5");
        nomHTML.appendChild(document.createTextNode("Identifiant : " + this.name));
        this.login.appendChild(nomHTML);
        inventoryManager.getInventory();
        player.name = this.name;
        //playerManager.getPlayers();
    }
}