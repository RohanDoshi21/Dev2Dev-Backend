let express = require("express");
const { isAuthenticated } = require("../middlewares/user_verification");
const { retrieveQuestions, retrieveQuestionById, createQuestion, updateQuestion, deleteQuestion } = require("../controllers/question_controller.js");

let router = express.Router();

router.get("/", retrieveQuestions);

router.get("/:id", retrieveQuestionById);

router.post("/", isAuthenticated, createQuestion);

router.put("/:id", isAuthenticated, updateQuestion);

router.delete("/:id", isAuthenticated, deleteQuestion);

module.exports = router;
