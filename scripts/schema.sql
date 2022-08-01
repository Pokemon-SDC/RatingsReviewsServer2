
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  rating INT NOT NULL,
  reviewer_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  summary VARCHAR NULL,
  body VARCHAR NOT NULL,
  response VARCHAR NULL,
  created_at BIGINT NOT NULL,
  reported BOOLEAN NOT NULL DEFAULT FALSE,
  recommend BOOLEAN NOT NULL DEFAULT FALSE,
  helpfulness INT NOT NULL DEFAULT 0
);

CREATE INDEX review_product_id_idx ON "reviews"(product_id);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  review_id INT,
  CONSTRAINT fk_review
    FOREIGN KEY(review_id)
      REFERENCES "reviews"(id)
);

CREATE INDEX photos_review_id_idx ON "photos"(review_id)

CREATE TABLE characteristics (
  id SERIAL PRIMARY KEY,
  characteristic TEXT NOT NULL,
  product_id INT NOT NULL,
  total_reviews INT NULL DEFAULT 0,
  average_value DECIMAL NULL DEFAULT 0
);

CREATE INDEX char_product_id_idx ON "characteristics"(product_id);

CREATE TABLE characteristic_reviews (
  id SERIAL PRIMARY KEY,
  char_id INT,
    CONSTRAINT fk_char
      FOREIGN KEY(char_id)
        REFERENCES "characteristics"(id),
  char_value INT NOT NULL,
  review_id INT NOT NULL,
  CONSTRAINT fk_review
    FOREIGN KEY(review_id)
      REFERENCES "reviews"(id)
);

CREATE INDEX char_reviews_char_id_idx ON "characteristic_reviews"(char_id);

-- CREATE TABLE characteristic_averages (
--   id SERIAL PRIMARY KEY,
--   char_id INT NOT NULL,
--   average_value DECIMAL NOT NULL,
--   total_reviews INT NOT NULL
-- )


-- CREATE INDEX char_product_id ON "characteristics"(product_id);
-- CREATE INDEX char_product_id ON "characteristics"(product_id);



-- SELECT
--    table_name,
--    column_name,
--    data_type
-- FROM
--    information_schema.columns
-- WHERE
--    table_name = 'reviews';