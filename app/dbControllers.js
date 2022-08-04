const { Client, Pool } = require("pg");
const Promise = require("bluebird");

let connection = `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});
const db = Promise.promisifyAll(pool, { multiArgs: true });
const reviewsString =
  "WITH \
    count_reviews \
  AS \
    (SELECT * from reviews r where r.product_id = $1 order by id limit $2 offset $3) \
    SELECT JSON_BUILD_OBJECT('product_id',$1::int, 'page', $5::int, 'count', COUNT(results), 'results', JSON_AGG(results)) from (\
  SELECT \
    count_reviews.body, \
    COALESCE(photoJoinArr, '[]') photos, \
    TO_TIMESTAMP(count_reviews.created_at/1000) date, \
    count_reviews.helpfulness, \
    count_reviews.rating, \
    count_reviews.recommend, \
    count_reviews.response, \
    count_reviews.id, \
    count_reviews.reviewer_name, \
    count_reviews.summary \
  FROM \
    count_reviews \
  LEFT JOIN \
    ( \
    SELECT \
      count_reviews.id, \
      JSON_AGG(JSON_BUILD_OBJECT(p.id, p.url)) photoJoinArr \
    FROM \
      photos p \
    INNER JOIN \
      count_reviews \
    ON \
      p.review_id = count_reviews.id \
    group by count_reviews.id \
    ) photoJoin \
  ON \
    photoJoin.id = count_reviews.id \
  WHERE \
    count_reviews.product_id = $1 \
  AND \
    count_reviews.reported = false \
  ORDER BY \
  $4) results";
const metaString =
  "SELECT JSON_BUILD_OBJECT(\
  'characteristics', JSONB_OBJECT_AGG(characteristic, charObj), \
  'ratings', JSONB_OBJECT_AGG(ratingsTable.rating, ratingsTable.count), \
  'recommend', JSONB_OBJECT_AGG(recommendTable.recommend, recommendTable.count) \
  ) \
FROM \
  ( \
    SELECT \
    c.product_id, \
    c.characteristic, \
    JSON_BUILD_OBJECT( \
      'id', c.id, \
      'value', AVG(cr.char_value) \
      ) charObj \
    FROM characteristic_reviews cr \
    INNER JOIN \
      characteristics c \
    ON \
      c.id = cr.char_id \
    WHERE \
      c.product_id = $1 \
    GROUP BY \
      c.id \
  ) charTable \
INNER JOIN \
  ( \
    SELECT \
      r.product_id, \
      rating, \
      COUNT(*) \
    FROM reviews r \
    WHERE \
      r.product_id = $1 \
    GROUP BY \
      rating, \
      r.product_id \
  ) ratingsTable \
ON ratingsTable.product_id = charTable.product_id \
INNER JOIN \
  ( \
    SELECT \
      r.product_id, \
      r.recommend, \
      COUNT(*) \
    FROM \
      reviews r \
    WHERE \
      r.product_id = $1 \
    GROUP BY \
      r.recommend, \
      r.product_id \
  ) recommendTable \
ON \
ratingsTable.product_id = recommendTable.product_id;";
const reviewQuery =
  "INSERT INTO \
        reviews (\
          product_id, \
          rating, \
          reviewer_name, \
          email, \
          summary, \
          body, \
          response, \
          created_at, \
          reported, \
          recommend, \
          helpfulness) \
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) \
      RETURNING id";
const photoQuery =
  "\
      INSERT INTO \
        photos (\
          url, \
          review_id) \
      VALUES ($1, $2)";
const charsQuery =
  "\
      INSERT INTO \
        characteristic_reviews (\
          char_id, \
          char_value, \
          review_id) \
      VALUES ($1, $2, $3)";

const sorts = {
  helpful: "count_reviews.helpfulness DESC",
  newest: "count_reviews.created_at DESC",
  relevant: "count_reviews.helpfulness DESC, count_reviews.created_at DESC",
};

module.exports = {
  getCount: function (table) {
    return db.queryAsync(`SELECT COUNT(*) FROM ${table}`).then((data) => {
      return data[0].rows[0].count;
    });
  },

  getReviewsById: function (req, res) {
    let { product_id, page, count, sort } = req.query;
    const sortMethod = sorts[sort] || "count_reviews.id ASC";
    const offset = page * count - count;
    const reviewQuery = {
      text: reviewsString,
      values: [product_id, count, page * count - count, sortMethod, page],
    };
    return db
      .query(reviewQuery)
      .then((data) => {
        res.send(data.rows[0].json_build_object);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  },

  getMeta: function (req, res) {
    return db
      .queryAsync(metaString, [req.query.product_id])
      .then((data) => {
        res.status(200).send(data[0].rows[0].json_build_object);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send();
      });
  },

  addReview: async function (req, res) {
    const client = await pool.connect();
    let x = new Date().getTime();
    let charObj = req.body.characteristics;
    let reviewValues = [
      parseInt(req.body.product_id),
      parseInt(req.body.rating),
      req.body.name,
      req.body.email,
      req.body.summary,
      req.body.body,
      null,
      parseInt(x),
      false,
      req.body.recommend,
      0,
    ];
    try {
      await client.query("BEGIN");
      let reviewId = await client.query(reviewQuery, reviewValues);
      let charObjArr = [];
      for (let k in charObj) {
        charObjArr.push([parseInt(k), charObj[k]]);
      }
      await Promise.all([
        Promise.all(
          req.body.photos.map(function (url) {
            let photoValues = [url, reviewId.rows[0].id];
            return client.query(photoQuery, photoValues);
          })
        ),
        Promise.all(
          charObjArr.map(function (charTuple) {
            return client.query(charsQuery, [
              ...charTuple,
              reviewId.rows[0].id,
            ]);
          })
        ),
      ]);
      await client.query("COMMIT");
      res.status(201);
    } catch (e) {
      res.status(400);
      console.log(e);
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
      res.send();
      return;
    }
  },

  reportReview: function (req, res) {
    return db
      .queryAsync(
        "\
      UPDATE reviews \
        SET reported = true \
      WHERE \
        id = $1;",
        [req.params.review_id]
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
      "\
      UPDATE reviews \
        SET helpfulness = helpfulness + 1 \
      WHERE \
        id = $1;",
      [req.params.review_id]
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
