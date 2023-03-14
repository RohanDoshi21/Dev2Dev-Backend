let express = require("express");
const { isAuthenticated } = require("../middlewares/user_verification");
const { CreateVoteQuestions, UpdateVoteQuestions, CreateVoteAnswers, UpdateVoteAnswers } = require("../controllers/vote_controller");

let router = express.Router();

// Upvote a question
router.post("/question/:id", isAuthenticated, CreateVoteQuestions);

// Update the vote for a question
// TODO: Think about the logic to update the vote
// router.put("/question/:id", isAuthenticated, UpdateVoteQuestions);

// Vote a answer
router.post("/answer/:id", isAuthenticated, CreateVoteAnswers);

// Update the vote for a answer
// TODO: Think about the logic to update the vote
// router.put("/answer/:id", isAuthenticated, UpdateVoteAnswers);


module.exports = router;