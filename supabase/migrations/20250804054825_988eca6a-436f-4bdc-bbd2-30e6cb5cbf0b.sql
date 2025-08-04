-- Delete incorrect data for Bank Al-Bilad that has wrong price
DELETE FROM stocks WHERE symbol = '1140.SR' AND price > 100;

-- Also clean up any other Saudi stocks with unrealistic high prices
DELETE FROM stocks WHERE symbol LIKE '%.SR' AND price > 300;