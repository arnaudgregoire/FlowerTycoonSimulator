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

  function createCookie(nom, valeur, jours) {
    // Le nombre de jours est spécifié
            if (jours) {
    var date = new Date();
                    // Converti le nombre de jour en millisecondes
    date.setTime(date.getTime()+(jours*24*60*60*1000));
    var expire = "; expire="+date.toGMTString();
    }
            // Aucune valeur de jours spécifiée
    else var expire = "";
    document.cookie = nom+"="+valeur+expire+"; path=/";
    }

    function readCookie(nom) {
      // Ajoute le signe égale virgule au nom
              // pour la recherche
              var nom2 = nom + "=";
              // Array contenant tous les cookies
      var arrCookies = document.cookie.split(';');
              // Cherche l'array pour le cookie en question
      for(var i=0;i < arrCookies.length;i++) {
        var a = arrCookies[i];
        // Si c'est un espace, enlever
        while (a.charAt(0)==' ') {
          a = a.substring(1,a.length);
        }
        if (a.indexOf(nom2) == 0) {
          return a.substring(nom2.length,a.length);
        }
      }
              // Aucun cookie trouvé
      return null;
      }

  if (isNode) {
    module.exports = {
      getRandomColor: getRandomColor,
      generateID: generateID
    };
  }
  else {
    window.Utility = {
      getRandomColor: getRandomColor,
      generateID: generateID,
      createCookie: createCookie,
      readCookie: readCookie
    };
  }
})();
