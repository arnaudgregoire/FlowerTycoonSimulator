/**
 * La classe représentant le terrain coté client
 */
class Terrain{
    /**
     * Appelé lors du rafraichissement de la page, le terrain est stocké sous forme d'une 2d-array d'objets Cases
     * @param {int} nbHauteur 
     * @param {int} nbLargeur 
     */
    constructor(nbHauteur, nbLargeur){
        this.nbHauteur = nbHauteur;
        this.nbLargeur = nbLargeur;
        this.cases = new Array(nbHauteur);
        // Initialisation de la matrice contenant les cases
        for (var i = 0; i < nbHauteur; i++) {
            this.cases[i] = new Array(nbLargeur);
        }
        this.createTable();
        this.update();
    }
    /**
     * Créé la 2d-aarray de case vide ainsi qu'une représentation graphique du terrain
     */
    createTable(){
        for (let i = 0; i < this.nbHauteur; i++) {
            let ligne = document.createElement("tr");
            for (let j = 0; j < this.nbLargeur; j++) {
                this.cases[i][j] = new Case(i,j);
                ligne.appendChild(this.cases[i][j].dom);
            }
        document.getElementById("map").appendChild(ligne);
        }
    }
    update(){

    }
}