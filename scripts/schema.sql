
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

CREATE INDEX review_product_id ON "reviews"(product_id);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  review_id INT,
  CONSTRAINT fk_review
    FOREIGN KEY(review_id)
      REFERENCES "reviews"(id)
);

CREATE TABLE characteristics (
  id SERIAL PRIMARY KEY,
  characteristic TEXT NOT NULL,
  product_id INT NOT NULL
);

CREATE INDEX char_product_id ON "characteristics"(product_id);

CREATE TABLE characteristic_reviews (
  id SERIAL PRIMARY KEY,
  char_id INT,
    CONSTRAINT fk_char
      FOREIGN KEY(char_id)
        REFERENCES "characteristics"(id),
  char_value DECIMAL NOT NULL,
  review_id INT NOT NULL,
  CONSTRAINT fk_review
    FOREIGN KEY(review_id)
      REFERENCES "reviews"(id)
);


-- SELECT
--    table_name,
--    column_name,
--    data_type
-- FROM
--    information_schema.columns
-- WHERE
--    table_name = 'reviews';