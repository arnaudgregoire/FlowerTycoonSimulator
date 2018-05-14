/**
 * L'ensemble des classes cases. La class Case est une classe absraite qui n'est pas instancié
 * même si elle a un constructeur
 */
class Case{
	constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

module.exports = Case;