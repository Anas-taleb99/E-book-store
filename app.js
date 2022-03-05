// express 

const express = require("express");
const app = express();
const path = require("path");

// controllers
const factory = require("./controllers/handleFactory");

// serving my static file
app.use(express.static(__dirname + "/public"));

// serving bootstrap files
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use('/font', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font')))
app.use("/javascript", express.static(path.join(__dirname, "public", "javascript")))

// append data in request body
app.use(express.urlencoded({ extended: false }));

// db 
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db_store.db');
// ejs
app.set("view engine","ejs");

let myuser;
let mypurchase;
let users = [];

const restricTo = (...roles) => {
  if (!myuser)
    return false;

  if (!roles.includes(myuser.Rule))
    return false;
  
  return true
}

app.post('/search', async (req,res)=> {
  let newBooks = [];
  const { titlesearch } = req.body;

  await new Promise((resolve, reject) => {
    //SELECT title FROM pages WHERE my_col LIKE %$param1% OR another_col LIKE %$param2%;
    db.all(
      `SELECT * FROM booksdb where Book_title LIKE '${titlesearch}%' OR author LIKE '${titlesearch}%' OR publisher LIKE '${titlesearch}%'`, 
      function(err,rows){
        if(err) { 
          console.log(err);
        } else { 
          newBooks = rows;
          resolve(rows);
         
        }
      });
  });

  res.render("home", { books: newBooks, myuser })
});



app.get("/", async (req,res) => {
  //select all books
  await new Promise((resolve, reject) => {
    db.all(`SELECT * from booksdb `, function(err,rows){
      if(err) { 
        console.log(err);
      } else { 
        books = rows;
        resolve(rows);
      }
    });
  });  

  if (!myuser) {
    myuser = {
      Username: "Guest",
      Rule: 0

    }
  }
   
  res.render("home",{books, myuser});
  
});

app.get("/login", (req,res) => {
  res.render("login");
});


app.get("/purchase", async (req,res) => {

  mypurchase = await new Promise((resolve, reject) => {
    db.serialize(()=> {
      db.all(`SELECT
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
      LEFT JOIN usersdb ON salesdb.userid = usersdb.userid`,function(err,rows){
        if(err) { 
          console.log(err);
        } else { 
          resolve(rows);
        }
      });
    });
  })

  res.render("purchase",{ mypurchase, myuser });
});

app.post("/login", async (req, res) => {
  // Select all users 
  myuser = null
  try {
    await new Promise((resolve, reject) => {
      db.get(
        `SELECT * from usersdb WHERE Username ='${req.body.username}' and Password ='${req.body.password}' `,
        function(err, user){
          if(err) { 
            reject("broo")
          } else {     
            myuser = user;
            
            resolve(user);
          }
        }
      );
    });
  } catch(e) {
    console.log(e);
  }
  
  if (!myuser) res.redirect("/login")

  res.redirect("/")
})

app.get("/addbook", (req, res) => {
  if (! restricTo(1, 2, 3))
    return res.redirect("/");
  res.render("addBook", {myuser})
})

app.post("/addbook", factory.uploadImg, factory.uploadHandler);

app.get("/edit/:id", async (req, res) => {
  let editBook;
  try {
    await new Promise((resolve, reject) => {
      db.each(
        `SELECT * from booksdb WHERE bookid ='${req.params.id}'`,
        function(err, book){
          if(err) { 
            console.log(err);
          } else { 
            editBook = book;
            console.log(book)
            resolve(book);
          }
        }
      );
    });
  } catch(e) {
    console.log(e);
  }
  res.render("editBook", { book: editBook, myuser });
})

app.post("/edit/:id", async (req, res) => {

  if (! restricTo(1, 2, 3))
    return res.redirect("/");

  const sql = `UPDATE booksdb SET 
    Book_title = '${req.body.title}', 
    author = '${req.body.author}', 
    year_of_publication = '${req.body.date}', 
    price = '${req.body.price}'
    WHERE bookid = '${req.params.id}'
  `;

  try {
    await new Promise((resolve, reject) => {
      db.run(sql);
      resolve("Done");
    })
  } catch(e) {
    console.log(e);
  }
  res.redirect("/")
})

app.get("/delete/:id", async (req, res) => {

  // if user doesn't have permistion to access this link redirect him
  if (! restricTo(1, 2, 3))
    return res.redirect("/");

  const sql = `DELETE FROM booksdb WHERE bookid = '${req.params.id}'`;
  try {
    await new Promise((resolve, reject) => {
      db.run(sql);
      resolve("Done");
    })
  } catch(e) {
    console.log(e);
  }
  res.redirect("/")
})

app.get("/buy/:userid/:bookid", async (req, res) => {

  const { userid, bookid } = req.params;

  const date = new Date().toISOString().split('T')[0];

  const sql = `INSERT INTO salesdb (userid, bookid, date_of_purchase)
  VALUES ('${userid}', '${bookid}', '${date}')`;

  try {
    await new Promise((reslove, reject) => {
      db.run(sql);
      reslove("Done");
    })
  } catch (e) {
    console.log(e);
  }
  res.redirect("/");
})

app.get("/signup", (req, res) => {

  res.render("signup")
})


app.listen(3000, () => {
    console.log("Node is running at port : 3000");
});