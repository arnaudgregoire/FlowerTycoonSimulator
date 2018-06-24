(function () {
    "use strict";
  
    class ActionsManager extends IManager {
        constructor(container) {
          super(container);
    
          this.plant_button = document.querySelector("#plant-button");
          this.harvest_button = document.querySelector("#harvest-button");
          this.fertilize_button = document.querySelector("#fertilize-button");
          this.buy_button = document.querySelector("#buy-button");
    
          // All event are handled by the client game
          this.plant_button.addEventListener("click", function() {
            this.dispatchUIEvent("plantClick", null);
          }.bind(this), false);
    
          this.harvest_button.addEventListener("click", function(){
            this.dispatchUIEvent("harvestClick", null);
          }.bind(this), false);
    
          this.fertilize_button.addEventListener("click", function(){
            this.dispatchUIEvent("fertilizeClickt", null);
          }.bind(this), false);
    
          this.buy_button.addEventListener("click", function(){
            this.dispatchUIEvent("buyClick", null);
          }.bind(this), false);
        }
    
        setButtonState(actions) {
          if (!!actions.plant) { this.plant_button.classList.remove("hidden") }
          else { this.plant_button.classList.add("hidden") }
    
          if (!!actions.harvest) { this.harvest_button.classList.remove("hidden") }
          else { this.harvest_button.classList.add("hidden") }
    
          if (!!actions.fertilize) { this.fertilize_button.classList.remove("hidden") }
          else { this.fertilize_button.classList.add("hidden") }
    
          if (!!actions.buy) { this.buy_button.classList.remove("hidden") }
          else { this.buy_button.classList.add("hidden") }
        }
      }
    
    window.ActionsManager = ActionsManager;
})()    