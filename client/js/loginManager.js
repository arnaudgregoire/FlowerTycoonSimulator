
class LoginManager{
    constructor(){
        this.login = document.getElementById('login');
        this.form = document.createElement('form');
        this.input = document.createElement("input");
        this.input.type = "text";
        this.submit = document.createElement("button");
        this.submit.appendChild(document.createTextNode("Login"));
        let self = this;
        this.submit.addEventListener("click",function(){self.tryLogin()});
        this.form.appendChild(this.input);
        this.form.appendChild(this.submit);
        this.login.appendChild(this.form);
    }

    tryLogin(){
        let name = this.input.value;
        console.log(name);
        send("login",JSON.stringify(
            {
                "fonction": "login",
                "param": {
                    "login": name
                }
            }
        )).then(function(response){
            if(response.ok) {
                response.json().then(function(json) {
                    if(json.reponse == 1){
                        console.log("JS");
                    }
                });
            }} 
        )
    }

}