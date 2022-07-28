const pg = require("pg");
const path = require("path");
var reviews_path = path.resolve("../data/reviews.csv");
var photos_path = path.resolve("../data/reviews_photos.csv");
var characteristics_path = path.resolve("../data/characteristics.csv");
var characteristic_reviews_path = path.resolve(
  "../data/characteristic_reviews.csv"
);

console.log(reviews_path);

// let connection = `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// let client = new pg.Client(connection);
// client.connect();

// let database_name = `ratings_reviews3`;

// let reviews_table = `CREATE TABLE reviews (\
//  id SERIAL PRIMARY KEY,\
//  product_id INT NOT NULL,\
//  rating INT NOT NULL,\
//  reviewer_name VARCHAR NOT NULL,\
//  email VARCHAR NOT NULL,\
//  summary VARCHAR NULL,\
//  body VARCHAR NOT NULL,\
//  response VARCHAR NULL,\
//  created_at BIGINT NOT NULL,\
//  reported BOOLEAN NOT NULL DEFAULT FALSE,\
//  recommend BOOLEAN NOT NULL DEFAULT FALSE,\
//  helpfulness INT NOT NULL DEFAULT 0\
// );`;

// let review_product_index = `CREATE INDEX review_product_id ON "reviews"(product_id);`;

// let photos_table = `CREATE TABLE photos (\
//  id SERIAL PRIMARY KEY,\
//  url TEXT NOT NULL,\
//  review_id INT,\
//  CONSTRAINT fk_review\
//  FOREIGN KEY(review_id)\
//  REFERENCES "reviews"(id)\
// );`;

// let characteristics_table = `CREATE TABLE characteristics (\
//  id SERIAL PRIMARY KEY,\
//  characteristic TEXT NOT NULL,\
//  product_id INT NOT NULL\
// );`;

// let characteristics_product_index = `CREATE INDEX char_product_id ON "characteristics"(product_id);`;

// let characteristic_reviews_table = `CREATE TABLE characteristic_reviews (\
//  id SERIAL PRIMARY KEY,\
//  char_id INT,\
//  CONSTRAINT fk_char\
//  FOREIGN KEY(char_id)\
//  REFERENCES "characteristics"(id),\
//  char_value DECIMAL NOT NULL,\
//  review_id INT NOT NULL,\
//  CONSTRAINT fk_review\
//  FOREIGN KEY(review_id)\
//  REFERENCES "reviews"(id)\
// );`;

// let copy_reviews = `COPY reviews(id, product_id, rating, created_at, summary, body, recommend, reported, reviewer_name, email, response, helpfulness)\
//  FROM ${reviews_path}\
//  DELIMITER ','\
//  CSV HEADER;`;

// let copy_photos = `COPY photos(id, review_id, url)\
//  FROM ${photos_path}\
//  DELIMITER ','\
//  CSV HEADER;`;

// let copy_characteristics = `COPY characteristics(id, product_id, characteristic)\
//  FROM ${characteristics_path}\
//  DELIMITER ','\
//  CSV HEADER;`;

// let copy_characteristics_reviews = `COPY characteristic_reviews(id, char_id, review_id, char_value)\
//  FROM ${characteristic_reviews_path}\
//  DELIMITER ','\
//  CSV HEADER;`;
