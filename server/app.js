let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let cors = require("cors");

let indexRouter = require("./routes/index");
let authRouter = require("./routes/auth");
let questionRouter = require("./routes/question");
let answerRouter = require("./routes/answer");
let tagRouter = require("./routes/tag");
let searchRouter = require("./routes/search");
let bodyParser = require("body-parser");
let votesRouter = require("./routes/votes");

let app = express();

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/questions", questionRouter);
app.use("/answers", answerRouter);
app.use("/tags", tagRouter);
app.use("/search", searchRouter);
app.use("/votes", votesRouter);

module.exports = app;
