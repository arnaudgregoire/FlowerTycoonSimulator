(function () {
    "use strict";
  
    class BoardManager extends IManager {
        constructor(container) {
          super(container);
    
          this.player_list = [];
        }
    
        /**
        * Go through the player list, and only update the HTML
        * if the list order has changed to boost performance
        */
        displayBoard(player_list) {
          let old_child, new_child;
    
          for (var i = 0; i < player_list.length; i++) {
            if (!this.player_list[i]) {
              new_child = this.createHTML(player_list[i]);
              this.container.appendChild(new_child);
            }
            else if (this.player_list[i] && player_list[i].id !== this.player_list[i].id) {
              old_child = this.getPlayerDiv(this.player_list[i].name);
              if(old_child == null) break; // the player is not on the leaderboard ???
    
              new_child = this.createHTML(player_list[i]);
              this.container.replaceChild(newChild, oldChild);
            }
          }
        }
    
        displayBoardTemp(player_list){
          this.clearBoard();
          for (var i = 0; i < player_list.length; i++) {
              this.container.appendChild(this.createHTML(player_list[i]));
          }
        }
    
        clearBoard(){
          while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
          }
        }
    
        getPlayerDiv(name) {
          if (this.container.hasChildNodes()) {
            for (var div of this.container.childNodes) {
              if (div.dataset.name === name) {
                return div;
              }
            }
          }
          return null;
        }
    
    
        createHTML(player) {
          let div = document.createElement("div");
          div.dataset.name = player.name;
          let p = document.createElement("p");
          p.innerText =  player.name + " " + player.score;
          p.style.color = player.color;
          div.appendChild(p);
          return div;
        }
      }
    window.BoardManager = BoardManager;
})()    