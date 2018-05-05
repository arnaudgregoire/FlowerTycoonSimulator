var EmptyCase = require('./case.js');

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

	toJSON(){
		let json = { cases: new Array(this.tailleX) };

		for (var i = 0; i < this.tailleX; i++) {
            json.cases[i] = new Array(this.tailleY);
		}
		
		for (let i = 0; i < this.tailleX; i++) {
			for (let j = 0; j < this.tailleY; j++) {
				console.log(this.cases[i][j]);
				json.cases[i][j] = this.cases[i][j].toJSON();	
			}
		}
		console.log(json);
		return json;
	}
}

module.exports = Terrain;