
--insert INTO characteristic_average_value ( char_id, average )
--select c.id, avg(char_value) from characteristic_reviews cr inner join characteristics c on cr.char_id = c.id group by c.id;

--select * from characteristic_average_value limit 200;

--create table sample_characteristics as select * from characteristics where id < 1000;
--select average, cav.char_id from characteristic_average_value cav where cav.char_id < 250;
--select * from characteristics c inner join characteristic_reviews cr on cr.char_id = c.id and c.id < 10;
--select average, cav.char_id from characteristic_average_value cav where cav.id < 100;

--explain update sample_characteristics sc
--set average_value = (select average from characteristic_average_value cav where cav.char_id = sc.id);

--select * from sample_characteristics limit 100;
--SELECT * FROM reviews WHERE product_id = 1;

--select * from reviews r inner join photos p on p.review_id = r.id and r.id = 5;
--select * from reviews r where r.id and JSON_BUILD_OBJECT(r.id);
--select json_agg(p.url), * from reviews r inner join photos p on p.review_id = r.id and r.product_id < 10;
--select * from reviews r left join photos p on p.review_id = r.id and r.id < 20;
-- select json_agg(p.url) from reviews r inner join photos p on p.review_id = r.id and r.product_id < 10;

-- SELECT r.*, json_agg(p.url) from reviews r inner join photos p on p.review_id = r.id and r.product_id = 4 group by r.id;
-- reviewsById;
-- SELECT r.*, json_agg(p.url) as photos from reviews r left join photos p on p.review_id = r.id where r.product_id = 2 group by r.id;
-- SELECT r.*, json_agg(json_build_object('id',p.id,'url', p.url)) as photos from reviews r left join photos p on p.review_id = r.id where r.product_id = 4 group by r.id;
-- meta;
-- select cr.* from characteristic_reviews cr inner join characteristics c on cr.char_id = c.id and c.product_id = 5;
-- select id from characteristics c where c.product_id = 1;
-- select * from characteristic_reviews cr inner join characteristics c on c.id = cr.char_id where c.product_id = 4;
-- select c.characteristic, avg from characteristic_reviews cr inner join characteristics c on c.id = cr.char_id where c.product_id = 4 group by c.id;
-- select c.characteristic, json_build_object(c.id,avg(cr.char_value)) from characteristic_reviews cr inner join characteristics c on c.id = cr.char_id where c.product_id = 7 group by c.id;

-- select json_build_object(r.rating, count(r.rating)) from reviews r where r.product_id = 4 group by r.id;


-- select r.id, r.rating, r.recommend, c.characteristic, json_build_object(c.id, avg(cr.char_value)) from reviews r inner join
-- characteristics c on c.product_id = r.product_id and r.product_id = 4 inner join characteristic_reviews cr on c.id = cr.char_id group by r.id, r.rating, r.recommend, c.id;


-- 1	1	4	1	1	Fit	1	0	0
-- 5	1	4	2	1	Fit	1	0	0
-- 2	2	3	1	2	Length	1	0	0
-- 6	2	4	2	2	Length	1	0	0
-- 3	3	5	1	3	Comfort	1	0	0
-- 7	3	5	2	3	Comfort	1	0	0
-- 4	4	4	1	4	Quality	1	0	0
-- 8	4	4	2	4	Quality	1	0	0


-- Fit	4.0000000000000000
-- Comfort	5.0000000000000000
-- Quality	4.0000000000000000
-- Length	3.5000000000000000

-- select COUNT(
-- 	select o.rating from reviews o where product_id = i.rating and o.rating = i.rating
-- ) from reviews i
-- where i.rating = 1 and i.product_id = 16;


-- select JSON_OBJECT_AGG(rating_counts.rating, rating_counts.count) ratings from
--   (select rating, COUNT(*) from reviews r where r.product_id = 16 group by rating) rating_counts

-- select JSON_OBJECT_AGG(recommend_counts.recommend, recommend_counts.count) recommend from
--   (select recommend, COUNT(*) from reviews r where r.product_id = 16 group by recommend) recommend_counts;

-- select JSON_BUILD_OBJECT(c.characteristic, json_build_object(c.id, avg(cr.char_value))) from reviews r inner join
-- characteristics c on c.product_id = r.product_id and r.product_id = 16 inner join characteristic_reviews cr on c.id = cr.char_id group by c.id;

-- select r.product_id, c.id, c.characteristic, cr.char_value from reviews r inner join characteristics c on c.product_id = r.product_id inner join
-- characteristic_reviews cr on cr.char_id = c.id where r.product_id = 16;

-- select JSON_BUILD_OBJECT(
-- 'body',photoJoin.body,
-- 'date',photoJoin.created_at,
-- 'helpfulness',photoJoin.helpfulness,
-- 'photos',photoJoin.arr,
-- 'rating',photoJoin.rating,
-- 'recommend',photoJoin.recommend,
-- 'response',photoJoin.response,
-- 'review_id',photoJoin.id,
-- 'reviewer_name',photoJoin.reviewer_name,
-- 'summary',photoJoin.summary
-- ) from reviews oor inner join
-- (select
-- 	r.*,
-- 	json_agg(p.url) arr from photos p right join (select * from reviews ir where ir.product_id = 1) on p.review_id = r.id group by r.id) photoJoin
-- on photoJoin.id = oor.id and oor.product_id = 1;

-- select JSON_AGG(p.url) from photos p inner join reviews r on r.id = p.review_id and r.product_id = 4 group by r.id;

-- select JSON_BUILD_OBJECT(
-- 'body',photoJoin.body,
-- 'date',photoJoin.created_at,
-- 'helpfulness',photoJoin.helpfulness,
-- 'photos',photoJoin.arr,
-- 'rating',photoJoin.rating,
-- 'recommend',photoJoin.recommend,
-- 'response',photoJoin.response,
-- 'review_id',photoJoin.id,
-- 'reviewer_name',photoJoin.reviewer_name,
-- 'summary',photoJoin.summary
-- ) from reviews oor inner join
-- (select
-- 	r.*,
-- 	json_agg(JSON_BUILD_OBJECT(p.id, p.url)) arr from photos p right join
-- 	(select * from reviews ir where ir.product_id = 4) r on p.review_id = r.id and r.product_id = 4 group by
-- 	p.review_id, r.id, r.rating, r.product_id, r.reviewer_name, r.email, r.summary, r.body, r.helpfulness, r.response, r.created_at, r.reported, r.recommend
-- 	) photoJoin
-- on photoJoin.id = oor.id and oor.product_id = 4;

-- select JSON_BUILD_OBJECT(
-- 'body',photoJoin.body,
-- 'date',photoJoin.created_at,
-- 'helpfulness',photoJoin.helpfulness,
-- 'photos',photoJoin.arr,
-- 'rating',photoJoin.rating,
-- 'recommend',photoJoin.recommend,
-- 'response',photoJoin.response,
-- 'review_id',photoJoin.id,
-- 'reviewer_name',photoJoin.reviewer_name,
-- 'photoIds', photoJoin.pIds,
-- 'summary',photoJoin.summary
-- ) from reviews oor inner join
-- (select
-- 	r.*,
-- 	json_agg(p.id) pIds,
-- 	json_agg(p.url) arr from photos p right join
-- 	(select * from reviews ir where ir.product_id = 16) r on p.review_id = r.id and r.product_id = 16 group by
-- 	p.review_id, r.id, r.rating, r.product_id, r.reviewer_name, r.email, r.summary, r.body, r.helpfulness, r.response, r.created_at, r.reported, r.recommend
-- 	) photoJoin
-- on photoJoin.id = oor.id and oor.product_id = 16;


-- SELECT
-- photoJoin.body,
-- photoJoin.created_at,
-- photoJoin.helpfulness,
-- photoJoin.arr,
-- photoJoin.rating,
-- photoJoin.recommend,
-- photoJoin.response,
-- photoJoin.id,
-- photoJoin.reviewer_name,
-- photoJoin.pIds,
-- photoJoin.summary
-- FROM reviews oor INNER JOIN
-- (select
-- 	r.*,
-- 	json_agg(p.id) pIds,
-- 	json_agg(p.url) arr from photos p right join
-- 	(select * from reviews ir where ir.product_id = 16) r on p.review_id = r.id and r.product_id = 16 group by
-- 	p.review_id, r.id, r.rating, r.product_id, r.reviewer_name, r.email, r.summary, r.body, r.helpfulness, r.response, r.created_at, r.reported, r.recommend
-- 	) photoJoin
-- on photoJoin.id = oor.id and oor.product_id = 16;

-- select p.review_id, JSON_AGG(JSON_BUILD_OBJECT(p.id,p.url)) from photos p inner join
-- (select * from reviews r where r.product_id = 4) ir on ir.id = p.review_id group by p.review_id;

-- select r.*, JSON_AGG(photoJoin.photoJoinObj) photos from reviews r left join
-- (select p.review_id, JSON_BUILD_OBJECT(p.id, p.url) photoJoinObj from photos p inner join reviews r on p.review_id = r.id)
-- photoJoin on photoJoin.review_id = r.id where r.product_id = 4 group by r.id;

-- select
-- r.body,
-- r.created_at,
-- r.helpfulness,
-- JSON_AGG(photoJoin.photoJoinObj) photos,
-- r.rating,
-- r.recommend,
-- r.response,
-- r.id review_id,
-- r.reviewer_name,
-- r.summary
-- from reviews r left join
-- (select p.review_id, JSON_BUILD_OBJECT(p.id, p.url) photoJoinObj from photos p inner join reviews r on p.review_id = r.id)
-- photoJoin on photoJoin.review_id = r.id where r.product_id = 15 group by r.id;

-- SELECT
--   r.body,
--   r.created_at,
--   r.helpfulness,
--   JSON_AGG(photoJoin.photoJoinObj) photos,
--   r.rating,
--   r.recommend,
--   r.response,
--   r.id review_id,
--   r.reviewer_name,
--   r.summary
-- FROM
--   reviews r
-- LEFT JOIN
--   (
--     SELECT
--       p.review_id,
--       JSON_BUILD_OBJECT(p.id, p.url) photoJoinObj
--     FROM
--       photos p
--     INNER JOIN
--       reviews r
--     ON
--       p.review_id = r.id
--     ) photoJoin
-- ON
--   photoJoin.review_id = r.id
-- WHERE
--   r.product_id = 15
-- AND
--   r.reported = false
-- GROUP BY
--   r.id;

-- select json_build_object('characteristics',jsonb_object_agg(characteristic, charObj)) from
-- (select c.product_id, c.characteristic, json_build_object('id',c.id, 'value', avg(cr.char_value)) charObj from characteristic_reviews cr
-- inner join characteristics c on c.id = cr.char_id where c.product_id = 1 group by c.id) charTable;

-- select rating_counts.product_id, JSON_OBJECT_AGG(rating_counts.rating, rating_counts.count) ratings from
-- 	(select r.product_id, rating, COUNT(*) from reviews r where r.product_id = 1 group by rating, r.product_id) rating_counts group by rating_counts.product_id;

-- select json_build_object('characteristics',jsonb_object_agg(characteristic, charObj),'ratings',jsonb_object_agg(ratingsTable.rating, ratingsTable.count)) from
-- (select c.product_id, c.characteristic, json_build_object('id',c.id, 'value', avg(cr.char_value)) charObj from characteristic_reviews cr
-- inner join characteristics c on c.id = cr.char_id where c.product_id = 16 group by c.id) charTable
-- inner join
-- (select r.product_id, rating, COUNT(*) from reviews r where r.product_id = 16 group by rating, r.product_id) ratingsTable
-- on ratingsTable.product_id = charTable.product_id;

-- SELECT JSON_BUILD_OBJECT(
--   'characteristics', JSONB_OBJECT_AGG(characteristic, charObj),
--   'ratings', JSONB_OBJECT_AGG(ratingsTable.rating, ratingsTable.count)
--   )
-- FROM
--   (
--     SELECT
--     c.product_id,
--     c.characteristic,
--     JSON_BUILD_OBJECT(
--       'id', c.id,
--       'value', AVG(cr.char_value)
--       ) charObj
--     FROM characteristic_reviews cr
--     INNER JOIN
--       characteristics c
--     ON
--       c.id = cr.char_id
--     WHERE
--       c.product_id = 16
--     GROUP BY
--       c.id
--   ) charTable
-- INNER JOIN
--   (
--     SELECT
--       r.product_id,
--       rating,
--       COUNT(*)
--     FROM reviews r
--     WHERE
--       r.product_id = 16
--     GROUP BY
--       rating,
--       r.product_id
--   ) ratingsTable
-- ON ratingsTable.product_id = charTable.product_id;

-- SELECT JSON_BUILD_OBJECT(
--   'characteristics', JSONB_OBJECT_AGG(characteristic, charObj),
--   'ratings', JSONB_OBJECT_AGG(ratingsTable.rating, ratingsTable.count)
-- )
-- FROM
--   (
--     SELECT
--       c.product_id,
--       c.characteristic,
--       JSON_BUILD_OBJECT
--         (
--           'id', c.id,
--           'value', AVG(cr.char_value),
--         ) charObj
--     FROM
--       characteristic_reviews cr
--     INNER JOIN
--     (
--       SELECT
--         characteristics cav
--       ON
--         c.id = cr.char_id
--       WHERE
--         c.product_id = 16
--       GROUP BY c.id)
--       charTable
--     )
--     INNER JOIN
--       (
--         SELECT
--           r.product_id,
--           rating,
--           COUNT(*)
--         FROM
--           reviews r
--         WHERE
--           r.product_id = 16
--         GROUP BY
--           rating,
--           r.product_id
--       ) ratingsTable
-- ON ratingsTable.product_id = charTable.product_id;
-- INNER JOIN
--   (
--     SELECT
--     r.product_id,
--     r.recommend,
--     COUNT(*)
--     FROM
--       reviews r
--     WHERE
--       r.product_id = 16
--     GROUP BY
--       r.recommend,
--       r.product_id
--   ) recommendTable
-- ON
-- ratingsTable.product_id = recommendTable.product_id;

-- inner join (select
-- r.product_id, r.recommend, COUNT(*)
-- from reviews r where r.product_id = 16 group by recommend, r.product_id) recommendTable
-- on ratingsTable.product_id = recommendTable.product_id;



pool.connect((err, client, done) => {
  const shouldAbort = err => {
    if (err) {
      console.error('Error in transaction', err.stack)
      client.query('ROLLBACK', err => {
        if (err) {
          console.error('Error rolling back client', err.stack)
        }
        // release the client back to the pool
        done()
      })
    }
    return !!err
  }
  client.query('BEGIN', err => {
    if (shouldAbort(err)) return
    const queryText = 'INSERT INTO users(name) VALUES($1) RETURNING id'
    client.query(queryText, ['brianc'], (err, res) => {
      if (shouldAbort(err)) return
      const insertPhotoText = 'INSERT INTO photos(user_id, photo_url) VALUES ($1, $2)'
      const insertPhotoValues = [res.rows[0].id, 's3.bucket.foo']
      client.query(insertPhotoText, insertPhotoValues, (err, res) => {
        if (shouldAbort(err)) return
        client.query('COMMIT', err => {
          if (err) {
            console.error('Error committing transaction', err.stack)
          }
          done()
        })
      })
    })
  })
})