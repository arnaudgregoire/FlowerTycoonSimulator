const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/flowertycoonsimulator';


exports.getDBinfos = function(req) {
	const client = new pg.Client(connectionString);
	client.connect();
	const query = client.query(req.body,function(err,res){
		done();
		if(err){
			console.log(err);
			res.status(400).send(err);
		}
		res.status(200).send(res.rows);
	});
	query.on('end', () => { client.end(); });
}


exports.postDBinfos = function(req) {
	const client = new pg.Client(connectionString);
	client.connect();
	const query = client.query(req.body);
	query.on('end', () => { client.end(); });
}

