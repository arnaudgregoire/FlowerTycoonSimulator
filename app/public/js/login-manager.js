(function () {
  "use strict";

  class LoginManager {
    constructor(doc) {
      this.doc = doc;
    }

    init() {
      this.doc.body.appendChild(this.createHTML());

      let button = this.doc.querySelector("#login-button");
      button.addEventListener("click", function (e) {
        e.preventDefault();
        this.sendLogin();
      }.bind(this), false);
    }

    createHTML() {
      let overlay = this.doc.createElement("div");
      overlay.id = "overlay";

      let form = this.doc.createElement("form");
      form.method = "get";
      form.id = "login-box";
      form.innerHTML = "<div><p>Authentification</p></div> \
      <div><label for='login-username'>Pseudo</label><input type='text' id='login-name'></div> \
      <div><label for='login-paswd'>Mot de passe</label><input type='password' id='login-paswd'></div> \
      <div><input type='submit' value='Connexion' class='button' id='login-button'></div>";

      overlay.appendChild(form);
      return overlay;
    }

    /**
    * Send a new window event with the login info
    */
    sendLogin() {
      let username = this.doc.querySelector("#login-name");
      let paswd = this.doc.querySelector("#login-paswd");
      if(username != null && paswd != null) {
        username = username.value;
        paswd = paswd.value;

        let event = new CustomEvent(String("sendLogin"), {
          detail: {
            username: username,
            password: paswd
          }
        });
        window.dispatchEvent(event);
      }
    }

    remove() {
      this.doc.querySelector("#wrap").classList.remove("hidden");
      if(this.doc.querySelector("#overlay") != null) {
        this.doc.body.removeChild(this.doc.querySelector("#overlay"));
      }
    }
  }

  window.LoginManager = LoginManager;
})();
