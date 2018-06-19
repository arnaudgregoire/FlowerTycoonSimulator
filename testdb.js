const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/flowertycoonsimulator';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
  'CREATE TABLE login(id SERIAL PRIMARY KEY, name VARCHAR(40) not null, active BOOLEAN)');
query.on('end', () => { client.end(); });

/*
await client.connect();
var res = await client.query('CREATE TABLE login(id SERIAL PRIMARY KEY, name VARCHAR(40) not null, active BOOLEAN)');
res.rows.forEach(row=>{
    console.log(row);
});
await client.end();
*/


