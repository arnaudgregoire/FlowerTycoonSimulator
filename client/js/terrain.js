class Terrain{
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