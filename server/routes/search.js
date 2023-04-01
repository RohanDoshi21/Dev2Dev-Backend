let express = require("express");
const {
  resetIndex,
  addToIndex,
  removeFromIndex,
  deleteIndex,
  createIndex,
} = require("../controllers/index_controller");
let { searchQuery } = require("../controllers/search_controller");
const client = require("../db/connect");

// const {} = require();

let router = express.Router();

router.get("/:index/:type", searchQuery);
router.get("/", searchQuery);
router.get("/delete_index", deleteIndex);
router.get("/create_index", createIndex);

module.exports = router;
