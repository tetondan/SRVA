const pg = require('pg');

const config = {
  user: 'Daniel', //env var: PGUSER
  database: 'srv-a', //env var: PGDATABASE
  password: '', //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 3000, // how long a client is allowed to remain idle before being closed
};

const pool = new pg.Pool(config);

module.exports = { pool };
