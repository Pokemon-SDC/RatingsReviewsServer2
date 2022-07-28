const pg = require("pg");
const bluebird = require("bluebird");

let connection = `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const client = new pg.Client(connection);
client.connect();

module.exports = {
  getCount: function (table) {
    client.query(`SELECT COUNT(*) FROM ${table}`, (err, res) => {
      console.log(res.rows[0].count);
    });
  },
};
