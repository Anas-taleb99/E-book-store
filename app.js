// express 

const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));

// db 
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db store.db');

// ejs
app.set("view engine","ejs");

let users;
// Select all users 
 db.serialize(()=> {
 	db.all("SELECT * from usersdb",function(err,rows){
		if (err) { 
      console.log(err);
		} else { 
      console.log(rows); 
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
      console.log(rows); 
      rows;
    }
  });
});

app.get("/", (req,res) => {
    res.sendFile(__dirname+ "/index.html");
});

app.get("/index", (req,res) => {
    res.sendFile(__dirname+ "/index.html");
});


app.get("/login", (req,res) => {
    // res.sendFile(__dirname+ "/login.html");
    console.log("fff", users);
    res.render("login", { users: users });
});


app.get("/manager", (req,res) => {
    res.sendFile(__dirname+ "/manager.html");
});

app.listen(3000, () => {
    console.log("Node is running at port : 3000");
});