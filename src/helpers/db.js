const db = require("knex")({
  client: "pg",
  version: "10.1",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_ACCOUNT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
  },
});

module.exports = {
  db,
};
