var EmptyCase = require('./case/emptyCase.js');

/**
 * La classe Terrain (instancié une seule fois représente l'ensemble des parcelles)
 * Elle est constitué de cases
 */
class Terrain{
	constructor(tailleX, tailleY){
		this.tailleX = tailleX;
		this.tailleY = tailleY;
		this.cases = [];
		this.cases = new Array(this.tailleX);
        // Initialisation de la matrice contenant les cases
        for (var i = 0; i < this.tailleX; i++) {
            this.cases[i] = new Array(this.tailleY);
		}
		// Remplissage du tableau de cases par des cases vides
		for (let i = 0; i < this.tailleX; i++) {
			for (let j = 0; j < this.tailleY; j++) {
				this.cases[i][j] = new EmptyCase(i,j);
			}
		}
	}
	/**
	 * La méthode toJSON est appelé dès qu'un client envoie une requete getTerrain (voir mainserver).
	 * 
	 */
	toJSON(){
		// Initialisation de la matrice contenant les cases au format json
		let json = { cases: new Array(this.tailleX) };

		for (var i = 0; i < this.tailleX; i++) {
            json.cases[i] = new Array(this.tailleY);
		}
		
		for (let i = 0; i < this.tailleX; i++) {
			for (let j = 0; j < this.tailleY; j++) {
				//console.log(this.cases[i][j]);
				// on appelle la méthode toJSON de chaque case qui va elle même remplir sa partie du json
				json.cases[i][j] = this.cases[i][j].toJSON();	
			}
		}
		//console.log(json);
		return json;
	}
}

module.exports = Terrain;