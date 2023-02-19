let express = require("express");
const { isAuthenticated } = require("../middlewares/user_verification");
const {
	retrieveAnswerForQuestion,
	createAnswer,
	updateAnswer,
	deleteAnswer,
} = require("../controllers/answer_controller");

let router = express.Router();

// GET all answers for a particular question
router.get("/:id", retrieveAnswerForQuestion);

router.post("/", isAuthenticated, createAnswer);

router.put("/:id", isAuthenticated, updateAnswer);

router.delete("/:id", isAuthenticated, deleteAnswer);

module.exports = router;
