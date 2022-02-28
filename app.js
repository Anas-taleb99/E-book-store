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

let users;

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

// select all books
 db.serialize(()=> {
  db.all("SELECT * from booksdb",function(err,rows){
    if(err) { 
      console.log(err);
    } else { 
      // console.log(rows); 
      rows;
    }
  });
});

app.get("/", (req,res) => {
    res.render("home");
});

app.get("/index", (req,res) => {
    res.sendFile(__dirname+ "/index.html");
});


app.get("/login", (req,res) => {
  // res.sendFile(__dirname+ "/login.html");
  res.render("login");
});

app.post("/login", (req, res) => {
  console.log("here", req.body);
  users.forEach(user => {
    if (
      user.Username === req.body.username &&
      user.Password === req.body.password
    ) {
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