const {Pool} = require('pg');
const url = require('url');

// debug flag for logging.
const debug = false;

// Parsing database url for config.
// Parsing for use in production to avoid leaking credentials.
const params = url.parse(process.env.DATABASE_URL);
if (debug) {
  console.log(url);
}

const auth = params.auth.split(':');

const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
};

if (debug) {
  console.log(config);
}

// Construct new connection pool.
// Default 20 connections, only attempts to connect on query.
const pool = new Pool(config);

// Export query function for use in application.
// Export defined in documentation at:
// https://node-postgres.com/guides/project-structure
// async/await query defined in documentation at:
// https://node-postgres.com/guides/async-express
module.exports = {
  query: (text, params, callback) => {
    const start = Date.now();
    return pool.query(text, params, (err, res) => {
      const duration = Date.now() - start;
      console.log('executed query', {text, duration});
      callback(err, res);
    });
  },
  aQuery: (text, params) => pool.query(text, params),
  getClient: (callback) => {
    pool.connect((err, client, done) => {
      callback(err, client, done);
    });
  },
  pool,
};
