let express = require("express");
let { searchQuery } = require("../controllers/search_controller");
const client = require("../db/connect");

// const {} = require();

let router = express.Router();

router.get("/:index/:type", searchQuery);
router.get("/", searchQuery);

module.exports = router;
