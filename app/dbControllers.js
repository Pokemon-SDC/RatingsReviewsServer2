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

  getReviewsById: function (id, count, page, sort) {
    let sortMethod;
    console.log(sort);
    if (sort === "helpful") {
      sortMethod = "r.helpfulness DESC";
    } else if (sort === "newest") {
      sortMethod = "r.created_at DESC";
    } else if (sort === "relevant") {
      sortMethod = "r.helpfulness DESC, r.created_at DESC";
    }
    return db
      .queryAsync(
        `SELECT
        r.body,
        r.created_at date,
        r.helpfulness,
        JSON_AGG(photoJoin.photoJoinObj) photos,
        r.rating,
        r.recommend,
        r.response,
        r.id review_id,
        r.reviewer_name,
        r.summary
      FROM
        reviews r
      LEFT JOIN
        (
          SELECT
            p.review_id,
            JSON_BUILD_OBJECT(p.id, p.url) photoJoinObj
          FROM
            photos p
          INNER JOIN
            reviews r
          ON
            p.review_id = r.id
          ) photoJoin
      ON
        photoJoin.review_id = r.id
      WHERE
        r.product_id = ${id}
      AND
        r.reported = false
      GROUP BY
        r.id
      ORDER BY
        ${sortMethod}
      LIMIT ${count};`
      )
      .then((data) => {
        console.log(data);
        data[0].rows.forEach(function (obj) {
          if (obj.photos[0] === null) {
            obj.photos = [];
          }
          obj.date = new Date(parseInt(obj.date));
        });
        let responseObject = {
          product_id: id,
          page: page,
          count: data[0].rows.length,
          results: data[0].rows,
        };
        return responseObject;
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

  getMeta: function (id) {
    return db
      .queryAsync(
        `select c.characteristic, json_build_object(c.id,avg(cr.char_value)) from characteristic_reviews cr
        inner join characteristics c on c.id = cr.char_id where c.product_id = 7 group by c.id;`
      )
      .then((data) => {
        return data[0].rows;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  reportReview: function (id) {
    db.queryAsync(
      `
      UPDATE reviews
      SET reported = true
      WHERE
      id = ${id};`
    ).then(() => {});
  },
};
