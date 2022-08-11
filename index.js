const express = require("express");
const app = express();
var session = require("express-session");

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    secret: "nottoday",
    resave: false,
    saveUninitialized: true,
    maxAge: 36000000,
  })
);

app.get("/", function (req, res) {
  console.log("세션 : ", req.session.user);
  const user = req.session.user;
  res.render("index.ejs", {
    user: user,
  });
});

app.get("/step1", function (req, res) {
  res.render("open_step1.ejs");
});

app.get("/img", function (req, res) {
  var path = req.query._path;
  // var path = __dirname + "/uploadedFiles/test.jpg"
  res.sendFile(__dirname + "/" + path);
});

app.get("/detail", function (req, res) {
  res.render("project_detail.ejs");
});

app.get("/creator", function(req, res){
  res.render("creator.ejs")
})

app.get("/list", function (req, res) {
  connection.query("select * from project_enroll", [], (err, result) => {
    if (err) {
      console.log(err);
      res.send("SQL Error");
    } else {
      const user = req.session.user;
      res.render("project_list.ejs", { list: result, user: user });
    }
  });
});


app.get("/theater", function (req, res) {
  res.render("theater.ejs");
});

app.post("/subscription", function (req, res) {
  var email = req.body._email;
  connection.query(
    `insert into subscription values (?)`,
    [email],
    function (err, result) {
      if (err) {
        console.log(err);
        res.send("select error");
      } else {
        res.redirect("/");
      }
    }
  );
});

const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "1234",
  database: "crowdfunding",
});

var login = require("./routes/login.js");
app.use("/login", login);

var sign = require("./routes/sign.js");
app.use("/sign_up", sign);

var enroll = require("./routes/enroll.js");
app.use("/step2", enroll);

const port = 3000;
app.listen(port, function () {
  console.log("server start");
});
