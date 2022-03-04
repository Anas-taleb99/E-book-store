-- SQLite
SELECT
salesdb.purchaseid AS purchase_id,
  salesdb.userid , 
  booksdb.bookid , 
  salesdb.date_of_purchase AS date, 
  usersdb.Username AS user_name, 
  booksdb.Book_title AS book_name, 
  booksdb.author,
  booksdb.publisher,
  booksdb.price
FROM salesdb
 LEFT JOIN booksdb ON salesdb.bookid = booksdb.bookid
 LEFT JOIN usersdb ON salesdb.userid = usersdb.userid