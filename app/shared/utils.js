(function () {
  "use strict";
  let isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');

  function getRandomColor () {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return color;
  }

  // USE nanoid instead, or smthing else, everyting is better (& more secure) than that
  function generateID () {
    let letters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let id_length = 8;

    let id = "";
    for (var i = 0; i < id_length; i++) {
      id += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return id;
    }

  if (isNode) {
    module.exports = {
      getRandomColor: getRandomColor,
      generateID: generateID,
      isCorrectUsername: isCorrectUsername,
      isCorrectPassword: isCorrectPassword
    };
  }
  else {
    window.Utility = {
      getRandomColor: getRandomColor,
      generateID: generateID
    };
  }

  function isCorrectUsername(name){
    if(((typeof name != "undefined") && (typeof name.valueOf() == "string")) && (name.length > 3)){
      return true;
    } else {
      return false;
    }
  }

  function isCorrectPassword(pass){
    if(((typeof pass != "undefined") && (typeof pass.valueOf() == "string")) && (pass.length > 3)){
      return true;
    } else {
      return false;
    }
  }
})();

