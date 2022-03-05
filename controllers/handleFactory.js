const path = require("path");
const fs = require("fs");
const multer = require("multer");

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db_store.db');

const upload = multer({
  dest: path.join(__dirname, "../", 'public', "img")
});

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

exports.uploadImg = upload.single("imgUrl")

exports.uploadHandler = (req, res) => {
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, "../", "public", "img", `cover-${Date.now()}.png`);

  if (req.file.mimetype.split("/")[0] === "image") {

    fs.rename(tempPath, targetPath, async err => {
    
      if (err) return handleError(err, res);
    
      let localPath = targetPath.replace(/\\/gi, "/");
      const sql = `INSERT INTO booksdb (Book_title, author, publisher, year_of_publication, price, url) 
        VALUES ('${req.body.title}', '${req.body.author}', '${req.body.publisher}', '${req.body.date}', '${req.body.price}', '${localPath.split("public")[1]}')`
    
        try {
          await new Promise((resolve, reject) => {
            db.run(sql);
            console.log("sqlfff")
            resolve("Done");
        })
      } catch(e) {
        console.log(e);
      }

      res
        .status(200)
        .redirect("/");
    });
  } else {
    fs.unlink(tempPath, err => {
      if (err) return handleError(err, res);
      res
        .status(403)
        .contentType("text/plain")
        .end("Only Images are allowed!");
    });
  }
}