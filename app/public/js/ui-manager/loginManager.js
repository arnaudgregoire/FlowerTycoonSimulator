(function () {
    "use strict";

  class LoginManager extends IManager {
      constructor(url) {
        super(null);
        this.url = url;
        this.socket_manager = new SocketManager(this.url);
        let buttonLogin = document.querySelector("#login-button");

        if (buttonLogin != null){
          buttonLogin.addEventListener("click", function (e) {
            e.preventDefault();
            this.sendLogin();
          }.bind(this), false);
        }

        let buttonRegister = document.querySelector("#register-button");

        if(buttonRegister != null){
          buttonRegister.addEventListener("click", function(e){
            e.preventDefault();
            this.sendRegistration();
          }.bind(this), false);
        }

        window.addEventListener("sendLogin", function (e) {
          this.handleLogin(e.detail);
        }.bind(this), false);
    
        window.addEventListener("sendRegistration", function(e){
        this.handleRegistration(e.detail);
        }.bind(this),false);    
      }
  
      /**
      * Send a new window event with the login info
      */
      sendRegistration(){
        console.log("sendRegistration");
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
        console.log("sendLogin");
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

      handleRegistration(info){
        console.log(info);
        this.socket_manager.sendMessage("register",JSON.stringify(
          {
            "description": "register",
            "param": info
          }
          ))
          .then((res)=>{
            console.log("info registration");
            let success = res.response;
            console.log(res);
            if(success) {
              console.log("registration successful")
            }
          }
        );
      }
    

    handleLogin(info) {
      console.log(info);
      this.socket_manager.sendMessage("login",JSON.stringify(
        {
          "description": "login",
          "param": info
        }
        ))
        .then((res)=>{
          console.log("info2");
          let success = res.response;
          console.log(res);
          if(success) {
            window.location.href = "/game";
          }
        }
      );
    }
  }
    window.LoginManager = LoginManager; 
})()    