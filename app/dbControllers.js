const pg = require("pg");
const Promise = require("bluebird");

let connection = `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const client = new pg.Client(connection);
client.connect();

const db = Promise.promisifyAll(client, { multiArgs: true });

module.exports = {
  getCount: function (table) {
    return db.queryAsync(`SELECT COUNT(*) FROM ${table}`).then((data) => {
      return data[0].rows[0].count;
    });
  },

  getReviewsById: function (id) {
    return db
      .queryAsync(`SELECT * FROM reviews WHERE product_id = ${id}`)
      .then((data) => {
        console.log(data);
        return data;
      });
  },

  getCharacteristicsById: function (id) {
    return db
      .queryAsync(`SELECT * FROM characteristics WHERE product_id = ${id}`)
      .then((data) => {
        return data[0].rows;
      });
  },

  getRecommendedById: function (id) {
    return db
      .queryAsync(`SELECT recommend FROM reviews WHERE product_id = ${id}`)
      .then((data) => {
        return data[0].rows;
      });
  },
};
