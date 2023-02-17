let express = require("express");
const {login, signup, logout, profile} = require("../controllers/auth_controller");
const {validateUserData} = require("../middlewares/user_verification");
let router = express.Router();

router.post("/login", login);

router.post("/signup", validateUserData, signup);

router.post("/logout", logout);

router.get("/profile", profile);

module.exports = router;
