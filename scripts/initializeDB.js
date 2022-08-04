const pg = require("pg");
const path = require("path");
require("dotenv").config();
var reviews_path = path.resolve("data/reviews.csv");
var photos_path = path.resolve("data/reviews_photos.csv");
var characteristics_path = path.resolve("data/characteristics.csv");
var characteristic_reviews_path = path.resolve(
  "data/characteristic_reviews.csv"
);

let connection = `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

let client = new pg.Client(connection);

let database_name = `ratings_reviews4`;

let reviews_table = `CREATE TABLE reviews (\
 id SERIAL PRIMARY KEY,\
 product_id INT NOT NULL,\
 rating INT NOT NULL,\
 reviewer_name VARCHAR NOT NULL,\
 email VARCHAR NOT NULL,\
 summary VARCHAR NULL,\
 body VARCHAR NOT NULL,\
 response VARCHAR NULL,\
 created_at BIGINT NOT NULL,\
 reported BOOLEAN NOT NULL DEFAULT FALSE,\
 recommend BOOLEAN NOT NULL DEFAULT FALSE,\
 helpfulness INT NOT NULL DEFAULT 0\
);`;

let photos_table = `CREATE TABLE photos (\
 id SERIAL PRIMARY KEY,\
 url TEXT NOT NULL,\
 review_id INT,\
 CONSTRAINT fk_review\
 FOREIGN KEY(review_id)\
 REFERENCES "reviews"(id)\
);`;

let characteristics_table = `CREATE TABLE characteristics (\
 id SERIAL PRIMARY KEY,\
 characteristic TEXT NOT NULL,\
 product_id INT NOT NULL,\
 total_reviews INT NULL DEFAULT 0,\
 average_value DECIMAL NULL DEFAULT 0\
);`;

let characteristic_reviews_table = `CREATE TABLE characteristic_reviews (\
 id SERIAL PRIMARY KEY,\
 char_id INT,\
 CONSTRAINT fk_char\
 FOREIGN KEY(char_id)\
 REFERENCES "characteristics"(id),\
 char_value DECIMAL NOT NULL,\
 review_id INT NOT NULL,\
 CONSTRAINT fk_review\
 FOREIGN KEY(review_id)\
 REFERENCES "reviews"(id)\
);`;

let review_rating_idx = `CREATE INDEX reviews_rating_idx ON "reviews"(rating);`;
let reviews_product_id_idx = `CREATE INDEX reviews_product_id_idx ON "reviews"(product_id);`;
let reviews_product_review_id_idx_pair = `CREATE INDEX reviews_product_review_id_idx_pair ON "reviews"(id, product_id);`;
let photos_review_id_idx = `CREATE INDEX photos_review_id_idx ON "photos"(review_id)`;
let char_product_id_idx = `CREATE INDEX char_product_id_idx ON "characteristics"(product_id);`;
let char_reviews_char_id_idx = `CREATE INDEX char_reviews_char_id_idx ON "characteristic_reviews"(char_id);`;

let copy_reviews = `COPY reviews(id, product_id, rating, created_at, summary, body, recommend, reported, reviewer_name, email, response, helpfulness)\
 FROM '${reviews_path}'\
 DELIMITER ','\
 CSV HEADER;`;

let copy_photos = `COPY photos(id, review_id, url)\
 FROM '${photos_path}'\
 DELIMITER ','\
 CSV HEADER;`;

let copy_characteristics = `COPY characteristics(id, product_id, characteristic)\
 FROM '${characteristics_path}'\
 DELIMITER ','\
 CSV HEADER;`;

let copy_characteristics_reviews = `COPY characteristic_reviews(id, char_id, review_id, char_value)\
 FROM '${characteristic_reviews_path}'\
 DELIMITER ','\
 CSV HEADER;`;

let dbExists = function (dbName) {
  client
    .query(`SELECT datname FROM pg_database WHERE datname='${dbName}'`)
    .then((res) => {
      return res.rows.length > 0;
    });
};

client
  .connect()
  .then(() => {
    return client.query(reviews_table);
  })
  .then(() => {
    return client.query(photos_table);
  })
  .then(() => {
    return client.query(characteristics_table);
  })
  .then(() => {
    return client.query(characteristic_reviews_table);
  })
  .then(() => {
    return client.query(reviews_product_id_idx);
  })
  .then(() => {
    return client.query(photos_review_id_idx);
  })
  .then(() => {
    return client.query(char_product_id_idx);
  })
  .then(() => {
    return client.query(char_reviews_char_id_idx);
  })
  .then(() => {
    return client.query(reviews_product_review_id_idx_pair);
  })
  .then(() => {
    console.log("copying reviews table ...");
    return client.query(copy_reviews);
  })
  .then(() => {
    return client.query(
      "UPDATE reviews SET response = null WHERE response = 'null';"
    );
  })
  .then(() => {
    return client.query(
      `SELECT
      SETVAL(
        (SELECT PG_GET_SERIAL_SEQUENCE('"reviews"', 'id')),
      (SELECT (MAX("id") + 1) FROM "reviews"),
      FALSE);`
    );
  })
  .then(() => {
    console.log("copying photos table ...");
    return client.query(copy_photos);
  })
  .then(() => {
    return client.query(
      `SELECT
      SETVAL(
        (SELECT PG_GET_SERIAL_SEQUENCE('"photos"', 'id')),
      (SELECT (MAX("id") + 1) FROM "photos"),
      FALSE);`
    );
  })
  .then(() => {
    console.log("copying characteristics table ...");
    return client.query(copy_characteristics);
  })
  .then(() => {
    return client.query(
      `SELECT
      SETVAL(
        (SELECT PG_GET_SERIAL_SEQUENCE('"characteristics"', 'id')),
      (SELECT (MAX("id") + 1) FROM "characteristics"),
      FALSE);`
    );
  })
  .then(() => {
    console.log("copying characteristic_reviews table ...");
    return client.query(copy_characteristics_reviews);
  })
  .then(() => {
    return client.query(
      `SELECT
      SETVAL(
        (SELECT PG_GET_SERIAL_SEQUENCE('"characteristic_reviews"', 'id')),
      (SELECT (MAX("id") + 1) FROM "characteristic_reviews"),
      FALSE);`
    );
  })
  .then(() => {
    return console.log(
      "Completed database initialization! Ending connection ..."
    );
  })
  .catch((err) => {
    console.log(err);
    console.log("Error completing database initialization!  Exitting ... ");
  });
// dbExists("ratings_reviews");
// dbExists("ratings_reviews2");

// client.query(
//   `SELECT datname FROM pg_database WHERE datname='ratings_reviews'`,
//   (err, res) => {
//     console.log(res.rows);
//   }
// );
