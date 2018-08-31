const pg = require('pg');

const config = {
	user: 'postgres',
	host: 'localhost',	
	password: 'postgres',
	database: 'flowertycoonsimulator',
	port: 5432
		
}

const pool = new pg.Pool(config)

pool.query('DELETE FROM login', (err, res)=>{
	console.log('Error : ')
	console.log(err)
	console.log('\n' + 'Result : ')
	console.log(res)
	pool.end()
});
