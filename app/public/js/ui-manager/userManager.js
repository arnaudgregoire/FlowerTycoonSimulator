(function () {
    "use strict";
  
    class UserManager extends IManager {
        constructor(container) {
          super(container);
          this.usernameHTML = document.createElement("p");
          this.scoreHTML = document.createElement("p");
          this.container.appendChild(this.usernameHTML);
          this.container.appendChild(this.scoreHTML);
        }
    
        setPlayerInfo(player) {
          this.setUsername(player.name);
          this.setPlayerScore(player.score);
        }
    
        setUsername(name) {
          this.usernameHTML.textContent = String(name);
        }
    
        setPlayerScore(score) {
          this.scoreHTML.textContent = "Score: " + String(score);
        }
      }
    
    window.UserManager = UserManager;
})()    