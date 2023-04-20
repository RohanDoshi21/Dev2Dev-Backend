let express = require("express");
const { isAuthenticated } = require("../middlewares/user_verification");
const {
	retrieveQuestions,
	retrieveQuestionById,
	createQuestion,
	updateQuestion,
	deleteQuestion,
	retrieveMyQuestions,
} = require("../controllers/question_controller");

let router = express.Router();

router.get("/", retrieveQuestions);

router.get("/my_questions/:id/", retrieveMyQuestions);

router.get("/:id", retrieveQuestionById);

router.post("/", isAuthenticated, createQuestion);

router.put("/:id", isAuthenticated, updateQuestion);

router.delete("/:id", isAuthenticated, deleteQuestion);

module.exports = router;
