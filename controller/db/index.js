const { Pool } = require('pg');
const url = require('url');

// Parsing database url for config. 
const params = url.parse(process.env.DATABASE_URL);
const dbAuth = params.dbAuth.split(':');

const config = {
  user: dbAuth[0],
  password: dbAuth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: true
};

// Construct new connection pool.
// Default 20 connections, only attempts to connect on query. 
const pool = new Pool(config);

// Export query function for use in application.
// Export defined in documentation at: node-postgres.com/guides/project-structure
module.exports = {
  query: (text, params, callback) => {
    const start = Date.now();
    return pool.query(text, params, (err, res) => {
      const duration = Date.now() - start;
      console.log('executed query', { text, duration, rows: res.rowCount });
      callback(err, res)
    })
  }
}
