var express = require("express");
var router = express.Router();
var multer = require("multer");

var mysql = require("mysql2");
var connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "1234",
  database: "crowdfunding",
});

// connect contract
var Caver = require("caver-js");
var cav = new Caver("https://api.baobab.klaytn.net:8651");
var product_contract = require("../build/nft.json");
var smartcontract = new cav.klay.Contract(
  product_contract.abi,
  "0x625dc27E8B0d3bdF0eF975EcC4fd25252fdaC710"
);

var account = cav.klay.accounts.createWithAccountKey(
  "0x08C99360461C959C3c1b7f76a9A7B36C42bF6f71",
  "0x71ccce90962eebc141a3a39168a6a0f71a1a4196260e8e7e13b3217872724ce1"
);
cav.klay.accounts.wallet.add(account);

router.post("/minting", async (req, res) => {
  const address = req.body.address;
  const tokenURI = req.body.tokenURI;
  const numberOfNft = req.body.numberOfNft;
  smartcontract.methods
    .mint(address, numberOfNft, tokenURI)
    .send({
      from: account.address,
      gas: 2000000,
    })
    .then((receipt) => {
      console.log(receipt);
      res.send(receipt);
    });
});

router.get("/nft", (req, res) => {
  const address = req.body.address;
  smartcontract.methods
    .updateMyNftList(address)
    .call()
    .then((receipt) => {
      console.log(receipt);
      res.send(receipt);
    });
});

var storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploadedFiles/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}__${file.originalname}`);
  },
});

var upload = multer({ dest: "uploadedFiles/" });
var uploadWithOriginalFilename = multer({ storage: storage });

router.get("/", function (req, res) {
  res.render("open_step2.ejs");
});

router.get("/step3", function (req, res) {
  res.render("open_step3.ejs");
});


router.post(
  "/project_enroll",
  uploadWithOriginalFilename.single("_thumbnail"),
  function (req, res) {
    var title = req.body._title;
    var thumbnail = req.file.path;
    var goal_amount = req.body._goalAmount;
    var estimated_amount = req.body._ea;
    var total_fee = req.body._totalFee;
    var payment_fee = req.body._paymentFee;
    var platform_fee = req.body._platformFee;
    var starting_date = req.body._startingDate;
    var funding_period = req.body._fundingPeriod;
    var ending_date = req.body._endingDate;
    var reward_image = req.file.path;
    var project_introduction = req.body._pI;
    var project_budget = req.body._projectBudget;
    var project_period = req.body._projectPeriod;
    var nft_details = req.body._nftDetails;
    var creator_name = req.body._cname;
    var creator_bank = req.body._cbank;
    var creator_account = req.body._caccount;
    var account_name = req.body._aname;

    console.log("값 확인 : ", title);
    connection.query(
      `insert into project_enroll values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        title,
        thumbnail,
        goal_amount,
        estimated_amount,
        total_fee,
        payment_fee,
        platform_fee,
        starting_date,
        funding_period,
        ending_date,
        reward_image,
        project_introduction,
        project_budget,
        project_period,
        nft_details,
        creator_name,
        creator_bank,
        creator_account,
        account_name,
      ],
      function (err, result) {
        if (err) {
          console.log(err);
          res.send("select error");
        } else {
          res.redirect("/step2/minting");
        }
      }
    );
  }
);


router.get("/detail", function (req, res) {
  var title = req.query._title;
  console.log(title);
  connection.query(
    `select * from project_enroll where title = ?`,
    [title],
    function (err, result) {
      if (err) {
        console.log(err);
        res.send("SQL Error");
      } else {
          const user = req.session.user
          res.render("project_detail.ejs", { info: result[0], user: user});
        
      }
    }
  );
});

router.get("/minting", function (req, res) {
  res.render("nft_minting.ejs");
});


module.exports = router;
