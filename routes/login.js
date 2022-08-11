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
  res.render("login.ejs", {
    code: 0,
  });
});

router.post("/login2", function (req, res) {
  var email = req.body._email;
  var pass = req.body._pass;
  console.log(email, pass);

  connection.query(
    `select * from user_list where email = ? and password = ?`,
    [email, pass],
    function (err, result) {
      if (err) {
        console.log(err);
        res.send("select error");
      } else {
        if (result.length > 0) {
          // 로그인 성공
          req.session.user = result[0].email;
                    res.redirect("/");
        } else {
          console.log(req.session.user)
          res.redirect("/login");
        }
      }
    }
  );
});

//로그아웃
router.get("/logout", function (req, res) {
  if (req.session.user) {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
