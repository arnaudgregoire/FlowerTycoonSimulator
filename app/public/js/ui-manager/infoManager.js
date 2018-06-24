(function () {
    "use strict";
  
    class InfoManager extends IManager {
        constructor(container) {
          super(container);
        }
    
        displayInfo(msg) {
          let p = document.createElement("p");
          p.classList.add("info-text");
          p.textContent = String(msg);
          this.container.appendChild(p);
        }
    
        clearInfo() {
          while (!!this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
          }
        }
      }
    window.InfoManager = InfoManager;
})()    