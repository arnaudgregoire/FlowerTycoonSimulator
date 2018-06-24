(function () {
    "use strict";
  
    class LoginManager extends IManager {
        constructor(container) {
          super(container);
    
          this.visible = false;
        }
    
        toggle() {
          if(this.visible) {
            this.visible = false;
            this.delete();
          }
          else {
            this.visible = true;
            this.create();
          }
        }
    
        create() {
          document.body.appendChild(this.getHTML());
    
          let buttonLogin = document.querySelector("#login-button");
          buttonLogin.addEventListener("click", function (e) {
            e.preventDefault();
            this.sendLogin();
          }.bind(this), false);
    
          let buttonRegister = document.querySelector("#register-button");
          buttonRegister.addEventListener("click", function(e){
            e.preventDefault();
            this.sendRegistration();
          }.bind(this), false);
        }
    
        delete() {
          document.querySelector("#wrap").classList.remove("hidden");
          if(document.querySelector("#overlay") != null) {
            document.body.removeChild(document.querySelector("#overlay"));
          }
        }
    
        getHTML() {
          let overlay = document.createElement("div");
          overlay.id = "overlay";
    
          let form = document.createElement("form");
          form.method = "get";
          form.id = "login-box";
          form.innerHTML = "<div><p>Authentification</p></div> \
          <div><label for='login-username'>Pseudo</label><input type='text' id='login-name'></div> \
          <div><label for='login-paswd'>Mot de passe</label><input type='password' id='login-paswd'></div> \
          <div><input type='submit' value='Connexion' class='button' id='login-button'></div> \
          <div><p>Registration</p></div> \
          <div><label for='login-username'>Pseudo</label><input type='text' id='register-name'></div> \
          <div><label for='login-paswd'>Mot de passe</label><input type='password' id='register-paswd'></div> \
          <div><input type='submit' value='Creer un compte' class='button' id='register-button'></div>";
    
          overlay.appendChild(form);
          return overlay;
        }
    
        /**
        * Send a new window event with the login info
        */
        sendRegistration(){
          console.log("sendregistration");
          let username = document.querySelector("#register-name");
          let paswd = document.querySelector("#register-paswd");
          if(username != null && paswd != null) {
            username = username.value;
            paswd = paswd.value;
            // TODO: encode password, add verification with regex ?
            this.dispatchUIEvent("sendRegistration", {
              player: {
                username: username,
                password: paswd,
              }
            });
          }
        }
    
    
        sendLogin() {
          let username = document.querySelector("#login-name");
          let paswd = document.querySelector("#login-paswd");
          if(username != null && paswd != null) {
            username = username.value;
            paswd = paswd.value;
            // TODO: encode password, add verification with regex ?
            this.dispatchUIEvent("sendLogin", {
              player: {
                username: username,
                password: paswd,
              }
            });
          }
        }
    
      }
     window.LoginManager = LoginManager; 
})()    