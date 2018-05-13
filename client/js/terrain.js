/**
 * La classe représentant le terrain coté client
 */
class Terrain{
    /**
     * Appelé lors du rafraichissement de la page, le terrain est stocké sous forme d'une 2d-array d'objets Cases
     * @param {int} nbHauteur 
     * @param {int} nbLargeur 
     */
    constructor(){
        this.nbHauteur = 0;
        this.nbLargeur = 0;
        this.cases = [];
        this.getTerrain();
    }
    /**
     * Créé la 2d-aarray de case vide ainsi qu'une représentation graphique du terrain
     */
    displayTerrain(){
        this.cleanTerrain();
        
        for (let i = 0; i < this.nbLargeur; i++) {
            let ligne = document.createElement("tr");
            for (let j = 0; j < this.nbHauteur; j++) {
                ligne.appendChild(this.cases[i][j].dom);
            }
        document.getElementById("map").appendChild(ligne);
        }
    }

    /**
     * Methode lancant une demande au serveur pour savoir le vertiable etat actuel  du  terrain serveur
     */
    getTerrain(){
        let self = this;
        send("getTerrain",JSON.stringify(
            {
                "fonction": "getTerrain"
            }
        )).then(function(response){
            if(response.ok) {
                response.json().then(function(json) {
                    console.log(json);
                    self.nbLargeur = json.cases.length;
                    self.nbHauteur = json.cases[0].length;
                    self.cases = new Array(self.nbLargeur);
                    // Initialisation de la matrice contenant les cases
                    for (var i = 0; i < self.nbLargeur; i++) {
                        self.cases[i] = new Array(self.nbHauteur);
                    }
                    for (var i = 0; i < json.cases.length; i++) {
                        for (var j = 0; j < json.cases[0].length; j++) {
                            self.cases[i][j] = CaseFactory.createCase(json.cases[i][j]);
                        }
                    }
                self.displayTerrain();
                });
            }} 
        )
    }

    cleanTerrain(){
        let map = document.getElementById("map");
        while (map.firstChild) {
            map.removeChild(map.firstChild);
        }
    }
}