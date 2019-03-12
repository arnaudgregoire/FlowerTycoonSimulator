var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/flowertycoonsimulator'; //
var utils      = require('../shared/utils.js');

class DbManager{
    async checkLogin(req){
        const results = [];
        let username = req.param.player.username;
        let password = req.param.player.password;
        let client = new pg.Client(connectionString);
        client.connect();
    
        const qry = 'SELECT * FROM login WHERE name=\''+username+'\' AND password=\''+password+'\';';
        console.log(qry);
        const result = await client.query(qry);
        client.end();
        return result;    
    }
    
    async addUser(req){
        const results = [];
        let username = req.param.player.username;
        let password = req.param.player.password;
        let client = new pg.Client(connectionString);
        client.connect();
    
        const qry = 'INSERT INTO login(name,password) VALUES (\''+username+'\',\''+password+'\');'
        console.log(qry);
        const result = await client.query(qry);
        client.end();
        return result;
    
    }

        
    /**
     * Methode appele lorsque que un joueur veut se connecter
     * @param {Request body} req
     *  Renvoie un json avec la reponse associe et une petite description de ce qui s est passe
     */


    async login(req) {
        let json = await this.checkLogin(req).then((results) => {
        if(results.rows[0]){
            /*
            console.log("hey");
            console.log(results.rows[0]);
            console.log("hi");
            console.log(results.rows[0].name);
            console.log(this);
            */
            let json = {"response": 1, "description" : "Heureux de vous revoir", "player": {"name": results.rows[0].name, "id":results.rows[0].id}};

            //console.log(this);
            return json;
        }else{
            console.log("bad credentials");
            let json = {"response": 0, "description" : "Wrong username or password"};
            return json;
        }
        });
        //let player = new Player(res.id,res.name,utils.getRandomColor());
        //this.addNewPlayer(player);
        return json;
    }
    
    async register(req){
        console.log("register");
        let json;
        if(utils.isCorrectUsername(req.param.player.username) && utils.isCorrectPassword(req.param.player.password)){
        json = await this.addUser(req).then((results)=>{
        console.log(results);
        let json = {"response": 1, "description" : "compte cree avec succes"};
        return json;
        });
        } else {
        json = {"response": 0, "description" : "nom d'utilisateur ou mot de passe invalide"}
        }
        
        return json;
    }
}

module.exports = DbManager;


