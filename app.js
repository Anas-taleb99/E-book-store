// express 

const express = require("express");
const app = express();
const path = require("path");
// serving my static file
app.use(express.static(__dirname + "/public"));

// serving bootstrap files
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

// append data in request body
app.use(express.urlencoded({ extended: false }));

// db 
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db_store.db');
// ejs
app.set("view engine","ejs");

let myuser;
let users = [];

// Select all users 
 db.serialize(()=> {
 	db.all("SELECT * from usersdb",function(err,rows){
		if (err) { 
      console.log(err);
		} else { 
      // console.log(rows); 
      users = rows;
    }
 	});
 });

// //select all books
 db.serialize(()=> {
  db.all("SELECT * from booksdb",function(err,rows){
    if(err) { 
      console.log(err);
    } else { 
      // console.log(rows); 
      books =rows;
    }
  });
});



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



app.get("/", (req,res) => {
  //select all books
 db.serialize(()=> {
    db.all("SELECT * from booksdb",function(err,rows){
      if(err) { 
        console.log(err);
      } else { 
        // console.log(rows); 
        books =rows;
      }
    });
  });

  res.render("home",{books, myuser});
});

// app.post('/', (req,res)=>{
//   let sql = "SELECT * FROM upload_test where title LIKE '% "+ 
//        req.body.titlesearch + "%'"
//   conn.query(sql, (err,results)=>{
//   if (err) throw err
//   res.json(console.log(sql))
      
//   })
// })





app.get("/index", (req,res) => {
    res.sendFile(__dirname+ "/index.html");
});


app.get("/login", (req,res) => {
  // res.sendFile(__dirname+ "/login.html");
  res.render("login");
});

app.post("/login", (req, res) => {

  users.forEach(user => {
    if (
      user.Username === req.body.username &&
      user.Password === req.body.password       
    ) {
      console.log("rule is ",user.Rule)
      myuser = user.Rule;
      res.redirect("/");
    }
  })
  res.redirect("/login");
})

app.get("/signup", (req, res) => {
  res.render("signup")
})

app.get("/manager", (req,res) => {
    res.sendFile(__dirname+ "/manager.html");
});

app.listen(3000, () => {
    console.log("Node is running at port : 3000");
});