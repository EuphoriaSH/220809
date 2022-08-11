var express = require("express");
var router = express.Router();

var mysql = require("mysql2");
var connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "1234",
  database: "crowdfunding",
});

router.get("/", function (req, res) {
  res.render("sign_up.ejs", {
    code: 0,
  });
});

router.post("/sign_up2", function (req, res) {
  var email = req.body._email;
  var pass = req.body._pass;
  var address = req.body._address;
  
  console.log(email, pass, address);

  connection.query(
    `insert into user_list values (?,?,?)`,
    [email, pass, address],
    function (err) {
      if (err) {
        console.log(err);
        res.send("signup insert error");
      } else {
        res.redirect("/sign_up/sign_complete");
      }
    }
  );
});

router.get("/sign_complete", function (req, res) {
  res.render("sign_completion.ejs", {
    code: 0,
  });
});

module.exports = router;
