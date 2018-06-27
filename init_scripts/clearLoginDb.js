const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/flowertycoonsimulator';
console.log(connectionString);
const client = new pg.Client(connectionString);
client.connect();
const result = client.query(
  'DELETE FROM login');
client.end();
