(function () {
  "use strict";

  class SocketManager {
    constructor(url) {
      this.base_url = url;
      this.socket = null;

      this.init();
      this.initEventListener();
    }

    init() {
      this.socket = new WebSocket("ws://" + this.base_url);
    }

    initEventListener() {
      this.socket.onopen = function (e) {
        this.socket.send("Voici un texte que le serveur attend de recevoir dès que possible !");
      }.bind(this);

      this.socket.onmessage = function (e) {
        this.handleResponse(JSON.parse(e.data));
      }.bind(this);
    }

    sendMessage(msg_type, data) {
      return fetch("http://" + this.base_url + msg_type, {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: data
      }).then(function (res) {
        if(res.ok){
          return res.json();
        }
      }).then(function (json) {
        if(json.hasOwnProperty("response") && typeof(json.description) != "undefined"){
          window.dispatchEvent(new CustomEvent("display",{ 'detail': json.description } ));
        }
        return json;
      })
    }

    handleResponse(json) {
      if (json.hasOwnProperty("response") && json.response == "update") {
        this.dispatchEvent(new CustomEvent("updateGame"));
      }
    }
  }

  window.SocketManager = SocketManager;
})();
