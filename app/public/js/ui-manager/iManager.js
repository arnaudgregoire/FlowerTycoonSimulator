(function () {
    "use strict";
  
    class IManager {
      constructor(container) {
        this.container = container;
      }
  
      dispatchUIEvent(event_name, event_data) {
        window.dispatchEvent( new CustomEvent(String(event_name), {
          detail: event_data
        }));
      }
    }
    window.IManager = IManager;
})()    