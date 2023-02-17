let express = require("express");
const {login, signup, logout, profile} = require("../controllers/auth_controller");
let router = express.Router();

router.post("/login", login);

router.post("/signup", signup);

router.post("/logout", logout);

router.get("/profile", profile);

module.exports = router;
