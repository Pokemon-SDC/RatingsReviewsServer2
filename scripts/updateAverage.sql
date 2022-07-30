UPDATE characteristics c
SET average_value = round(average_value * total_reviews) + cr.char_value / (total_reviews + 1),
SET total_reviews = total_reviews + 1,
WHERE
c.id = cr.char_id