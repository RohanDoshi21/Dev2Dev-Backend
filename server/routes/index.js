let express = require("express");
let router = express.Router();
const client = require("../db/connect");

router.get("/", (req, res) => {
  res.send("Nodejs running successfully");
});

/* GET home page. */
router.get("/ping", (req, res, next) => {
  console.log("Hello User");
  res.send("pong");
});

router.get("/insert", async (req, res, next) => {
  console.log("Test Inserting into table");

  const query =
    "insert into Users(first_name, last_name, email, phone_number, password, created_at, updated_at, reputation, dp_url) values('Rohan', 'Doshi', 'rohandoshi@gmail.com', '9325712554', 'rohandoshi21', '2022-06-21 19:10:25-07', '2022-06-21 19:10:25-07', 10.0, 'abc') returning *";

  console.log(query);
  try {
    const result = await client.query(query, []);
    res.send(result.rows);
  } catch (err) {
    console.log("Error");
    console.log(err);
    res.status(500).send("Error");
  }
});

router.get("/testGetUsers", async (req, res, next) => {
  console.log("Getting Users from table");

  const query = "select * from Users";

  console.log(query);
  try {
    const result = await client.query(query, []);
    res.send(result.rows);
  } catch (err) {
    console.log("Error");
    console.log(err);
    res.status(500).send("Error");
  }
});

module.exports = router;
