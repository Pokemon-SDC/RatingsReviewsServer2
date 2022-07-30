
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
