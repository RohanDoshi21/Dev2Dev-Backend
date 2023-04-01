const client = require("../db/connect");
const { addToIndex } = require("./index_controller");

exports.retrieveQuestions = async (req, res) => {
  // Pagination logic
  // Page size is defaulted to 20
  let questionsPerPage = 20;
  let page = parseInt(req.query.page) || 1;
  let offset = (page - 1) * questionsPerPage;

  // Also send the owner's name along with the question
  let query = `select q.*, concat(u.first_name, ' ', u.last_name) as name, u.email from Question q join Users u on q.owner = u.id LIMIT $1 OFFSET $2`;

  // let query = "select * from Question LIMIT $1 OFFSET $2";
  try {
    const data = await client.query(query, [questionsPerPage, offset]);
    return res.json({ data: { questions: data.rows } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

exports.retrieveQuestionById = async (req, res) => {
  // Add owener's name and email to the question
  let query = `select q.*, concat(u.first_name, ' ', u.last_name) as name, u.email from Question q join Users u on q.owner = u.id where q.id = $1`;
  // let query = "select * from Question where id = $1";
  try {
    const data = await client.query(query, [parseInt(req.params.id)]);
    if (data.rows.length === 0) {
      return res.status(404).json({ error: "Question not found." });
    }
    return res.json({ data: { question: { ...data.rows[0] } } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

exports.createQuestion = async (req, res) => {
  let query =
    "insert into Question (title, description, owner, upvotes, downvotes, created_at, status) values ($1, $2, $3, $4, $5, $6, $7) returning *";
  const date = new Date();
  let values = [
    req.body.title,
    req.body.description,
    req.user.id,
    0,
    0,
    date,
    "OPEN",
  ];

  let indexDoc = {};

  try {
    const response = await client.query(
      `SELECT first_name, last_name, email FROM Users WHERE id =  $1`,
      [req.user.id]
    );
    const userData = response["rows"][0];
    console.log("New user: ", userData);
    indexDoc = {
      description: req.body.description,
      title: req.body.title,
      created_at: date,
      status: "OPEN",
      upvotes: 0,
      downvotes: 0,
      owner: req.user.id,
      first_name: userData["first_name"],
      last_name: userData["last_name"],
      email: userData["email"],
      answers: null,
    };
  } catch (error) {
    console.log("Could not fetch user info");
  }

  try {
    const data = await client.query(query, values);
    await addToIndex(indexDoc);
    return res.json({ data: { question: { ...data.rows[0] } } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

exports.updateQuestion = async (req, res) => {
  let query =
    "update Question set title = $1, description = $2, status = $5 where id = $3 and owner = $4 returning *";
  let values = [
    req.body.title,
    req.body.description,
    parseInt(req.params.id),
    req.user.id,
    req.body.status,
  ];

  try {
    const data = await client.query(query, values);
    if (data.rows.length === 0) {
      return res.status(404).json({
        error:
          "Question not found or current user doesn't have permission to modify the question",
      });
    } else {
      return res.json({ data: { question: { ...data.rows[0] } } });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

exports.deleteQuestion = async (req, res) => {
  let query = "delete from Question where id = $1 and owner = $2 returning *";
  let values = [parseInt(req.params.id), req.user.id];

  try {
    const data = await client.query(query, values);
    if (data.rows.length === 0) {
      return res.status(404).json({
        error:
          "Question not found or current user doesn't have permission to delete the question",
      });
    } else {
      return res.json({ data: "Question deleted successfully" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};
