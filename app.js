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

// append data in request body
app.use(express.urlencoded({ extended: false }));

// db 
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db_store.db');
// ejs
app.set("view engine","ejs");

let myuser;
let users = [];

app.post('/search', async (req,res)=> {
  let newBooks = [];
  await new Promise((resolve, reject) => {
    db.all(`SELECT * FROM booksdb where Book_title LIKE '${req.body.titlesearch}%' `, function(err,rows){
      if(err) { 
        console.log(err);
      } else { 
        newBooks = rows;
        console.log("skrrrr", rows);
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
        console.log("skrrrr", rows);
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

app.post("/login", async (req, res) => {
  console.log('here')
  // Select all users 
  try {
    await new Promise((resolve, reject) => {
      db.each(
        `SELECT * from usersdb WHERE Username ='${req.body.username}' and Password ='${req.body.password}' `,
        function(err, user){
          if(err) { 
            console.log(err);
          } else { 
            myuser = user;
            console.log(user)
            resolve(user);
          }
        }
      );
    });
  } catch(e) {
    console.log(e);
  }

  if (!myuser) 
    res.redirect("/login");
  
  res.redirect("/")
})

app.get("/addbook", (req, res) => {
  res.render("addBook")
})



app.post("/addbook", factory.uploadImg, factory.uploadHandler);

// app.post('/addbook', (req, res) => {
//   console.log(req.body.imgUrl);
//   res.redirect("/addbook")
// })

app.get("/signup", (req, res) => {
  res.render("signup")
})


app.listen(3000, () => {
    console.log("Node is running at port : 3000");
});