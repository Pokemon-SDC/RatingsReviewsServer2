const { Client, Pool } = require("pg");
const Promise = require("bluebird");

let connection = `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = new Pool({
  user: process.env.DB_USER || process.env.DB_USER,
  password: process.env.DB_PW || process.env.DB_PASS,
  host: process.env.DB_HOST || process.env.DB_HOST,
  port: process.env.DB_PORT || process.env.DB_PORT,
  database: process.env.DB_NAME || process.env.DB_NAME,
});
const db = Promise.promisifyAll(pool, { multiArgs: true });

module.exports = {
  getCount: function (table) {
    return db.queryAsync(`SELECT COUNT(*) FROM ${table}`).then((data) => {
      return data[0].rows[0].count;
    });
  },

  getReviewsById: function (req, res) {
    console.log(req.query.product_id);
    let { product_id, page, count, sort } = req.query;
    let sortMethod = "r.id";
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
        r.product_id = ${product_id}
      AND
        r.reported = false
      GROUP BY
        r.id
      ORDER BY
        ${sortMethod}
      LIMIT ${count};`
      )
      .then((data) => {
        data[0].rows.forEach(function (obj) {
          if (obj.photos[0] === null) {
            obj.photos = [];
          }
          obj.date = new Date(parseInt(obj.date));
        });
        let responseObject = {
          product_id: product_id,
          page: page,
          count: data[0].rows.length,
          results: data[0].rows,
        };
        res.status(200).send(responseObject);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send();
      });
  },

  getMeta: function (req, res) {
    return db
      .queryAsync(
        `SELECT JSON_BUILD_OBJECT(
          'characteristics', JSONB_OBJECT_AGG(characteristic, charObj),
          'ratings', JSONB_OBJECT_AGG(ratingsTable.rating, ratingsTable.count),
          'recommend', JSONB_OBJECT_AGG(recommendTable.recommend, recommendTable.count)
          )
        FROM
          (
            SELECT
            c.product_id,
            c.characteristic,
            JSON_BUILD_OBJECT(
              'id', c.id,
              'value', AVG(cr.char_value)
              ) charObj
            FROM characteristic_reviews cr
            INNER JOIN
              characteristics c
            ON
              c.id = cr.char_id
            WHERE
              c.product_id = ${req.query.product_id}
            GROUP BY
              c.id
          ) charTable
        INNER JOIN
          (
            SELECT
              r.product_id,
              rating,
              COUNT(*)
            FROM reviews r
            WHERE
              r.product_id = ${req.query.product_id}
            GROUP BY
              rating,
              r.product_id
          ) ratingsTable
        ON ratingsTable.product_id = charTable.product_id
        INNER JOIN
          (
            SELECT
              r.product_id,
              r.recommend,
              COUNT(*)
            FROM
              reviews r
            WHERE
              r.product_id = ${req.query.product_id}
            GROUP BY
              r.recommend,
              r.product_id
          ) recommendTable
        ON
        ratingsTable.product_id = recommendTable.product_id;`
      )
      .then((data) => {
        res.status(200).send(data[0].rows[0].json_build_object);
        // return data[0].rows[0].json_build_object;
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send();
      });
  },

  addReview: async function (req, res) {
    const client = await pool.connect();
    let x = new Date().getTime();
    let reviewObj = req.body;
    let charObj = reviewObj.characteristics;
    let reviewValues = [
      parseInt(reviewObj.product_id),
      parseInt(reviewObj.rating),
      reviewObj.name,
      reviewObj.email,
      reviewObj.summary,
      reviewObj.body,
      null,
      parseInt(x),
      false,
      reviewObj.recommend,
      0,
    ];
    // clean this up omg;
    try {
      await client.query("BEGIN");
      const reviewQuery =
        "INSERT INTO reviews (product_id, rating, reviewer_name, email, summary, body, response, created_at, reported, recommend, helpfulness) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id";
      const response = await client.query(reviewQuery, reviewValues);
      const asyncLoop = async () => {
        for (let i = 0; i < reviewObj.photos.length; i++) {
          let values = [reviewObj.photos[i], response.rows[0].id];
          await client.query(
            "INSERT INTO photos (url, review_id) VALUES ($1, $2)",
            values
          );
        }
      };
      await asyncLoop();
      const asyncLoop2 = async () => {
        for (let k in charObj) {
          let values = [parseInt(k), parseInt(charObj[k]), response.rows[0].id];
          await client.query(
            "INSERT INTO characteristic_reviews (char_id, char_value, review_id) values ($1, $2, $3)",
            values
          );
        }
      };
      await asyncLoop2(); // successfully added to database
      await client.query("COMMIT");
      res.status(201);
    } catch (e) {
      res.status(400);
      console.log(e);
      await client.query("ROLLBACK");
      throw e;
      // could not enter into database;
    } finally {
      client.release();
      res.send();
      return;
    }
  },

  reportReview: function (req, res) {
    return db
      .queryAsync(
        `
      UPDATE reviews
        SET reported = true
      WHERE
        id = ${req.params.review_id};`
      )
      .then(() => {
        res.status(204).send();
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send();
      });
  },

  findReviewHelpful: function (req, res) {
    db.queryAsync(
      `
      UPDATE reviews
        SET helpfulness = helpfulness + 1
      WHERE
        id = ${req.params.review_id};`
    )
      .then(() => {
        res.status(204).send();
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send();
      });
  },
};
