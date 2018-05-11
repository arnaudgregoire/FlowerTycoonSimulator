class Plante{
    constructor(){
        this.age = 0;
        this.name = "";
        this.state = 0;
        this.famille = Plante.getFamille();
    }

    static getFamille(){
        return "plante";
    }
}

module.exports = Plante;