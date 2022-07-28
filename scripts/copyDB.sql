-- char_reviews id, char_id,review_id,value
-- CREATE TABLE characteristic_reviews (
--   id SERIAL PRIMARY KEY,
--   char_id INT,
--     CONSTRAINT fk_char
--       FOREIGN KEY(char_id)
--         REFERENCES "characteristics"(id),
--   char_value DECIMAL NOT NULL,
--   review_id INT NOT NULL,
--   CONSTRAINT fk_review
--     FOREIGN KEY(review_id)
--       REFERENCES "reviews"(id)
-- );


-- characteristics id, review_id, name

-- CREATE TABLE characteristics (
--   id SERIAL PRIMARY KEY,
--   characteristic TEXT NOT NULL,
--   product_id INT NOT NULL
-- );

COPY reviews(id, product_id, rating, created_at, summary, body, recommend, reported, reviewer_name, email, response, helpfulness)
FROM '/home/shannon/Desktop/hr_projects/RatingsReviewsServer2/data/reviews.csv'
DELIMITER ','
CSV HEADER;

COPY photos(id, review_id, url)
FROM '/home/shannon/Desktop/hr_projects/RatingsReviewsServer2/data/reviews_photos.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics(id, product_id, characteristic)
FROM '/home/shannon/Desktop/hr_projects/RatingsReviewsServer2/data/characteristics.csv'
DELIMITER ','
CSV HEADER;

--  id char_id review_id value
COPY characteristic_reviews(id, char_id, review_id, char_value)
FROM '/home/shannon/Desktop/hr_projects/RatingsReviewsServer2/data/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;


-- CREATE TABLE reviews (
--   id SERIAL PRIMARY KEY,
--   product_id INT NOT NULL,
--   rating INT NOT NULL,
--   reviewer_name VARCHAR(60) NOT NULL,
--   email VARCHAR(60) NOT NULL,
--   summary VARCHAR(60) NULL,
--   body VARCHAR(1000) NOT NULL,
--   response VARCHAR(1000) NULL,
--   created_at DATE NOT NULL DEFAULT CURRENT_DATE,
--   reported BOOLEAN NOT NULL DEFAULT FALSE,
--   recommend BOOLEAN NOT NULL DEFAULT FALSE,
--   helpfulness INT NOT NULL DEFAULT 0
-- );


-- id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness
-- 0,        1,    2,    3 ,   4       5   6           7       8             9               10      11

