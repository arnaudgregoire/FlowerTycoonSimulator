
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

    tryLogin(){
        let self = this;
        this.name = this.input.value;
        //console.log(this.name);
        send("login",JSON.stringify(
            {
                "fonction": "login",
                "param": {
                    "login": this.name
                }
            }
        )).then(function(response){
            if(response.ok) {
                response.json().then(function(json) {
                    if(json.reponse == 1){
                        self.correctLogin();
                    }
                });
            }} 
        )
    }

    correctLogin(){
        while (this.login.firstChild) {
            this.login.removeChild(this.login.firstChild);
        }
        let nomHTML = document.createElement("h3");
        nomHTML.appendChild(document.createTextNode("Identifiant : " + this.name));
        this.login.appendChild(nomHTML);
    }
}