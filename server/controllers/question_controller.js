const client = require("../db/connect");
const esClient = require("../db/elastic_connect");
const {
  addToIndex,
  removeFromIndex,
  updateToIndex,
} = require("./index_controller");

exports.retrieveQuestions = async (req, res) => {
  // Pagination logic
  // Page size is defaulted to 20
  let questionsPerPage = 10;
  let page = parseInt(req.query.page) || 1;
  let offset = (page - 1) * questionsPerPage;

  const option = req.query.sort;
  console.log("Option is: ", option);
  let query = `select q.*, concat(u.first_name, ' ', u.last_name) as name, u.email from Question q join Users u on q.owner = u.id ORDER BY q.created_at DESC LIMIT $1 OFFSET $2 `;
  switch (option) {
    case "asc":
      query = `select q.*, concat(u.first_name, ' ', u.last_name) as name, u.email from Question q join Users u on q.owner = u.id ORDER BY q.created_at ASC LIMIT $1 OFFSET $2 `;
      break;

    case "desc":
      query = `select q.*, concat(u.first_name, ' ', u.last_name) as name, u.email from Question q join Users u on q.owner = u.id ORDER BY q.created_at DESC LIMIT $1 OFFSET $2 `;
      break;

    case "by_upvotes":
      query = `select q.*, concat(u.first_name, ' ', u.last_name) as name, u.email from Question q join Users u on q.owner = u.id ORDER BY q.upvotes DESC LIMIT $1 OFFSET $2 `;
      break;

    case "most_ans":
      query = `select q.*, concat(u.first_name, ' ', u.last_name) as name, u.email, COALESCE(COUNT(ans.id), 0) as ans_count from Question q join Users u on q.owner = u.id 
          LEFT JOIN Answer ans ON ans.question_id=q.id 
          GROUP BY q.id, u.first_name, u.last_name, u.email
          ORDER BY ans_count DESC LIMIT $1 OFFSET $2 `;
      break;

    default:
      query = `select q.*, concat(u.first_name, ' ', u.last_name) as name, u.email from Question q join Users u on q.owner = u.id ORDER BY q.created_at LIMIT $1 OFFSET $2 `;
      break;
  }

  try {
    const data = await client.query(query, [questionsPerPage, offset]);
    const pageData = await client.query(`SELECT COUNT(id) FROM Question`);
    return res.json({
      data: {
        questions: data.rows,
        pages: Math.ceil(pageData.rows[0]["count"] / questionsPerPage),
      },
    });
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

    try {
      const data = await client.query(query, values);
      console.log("Returned DATA: ", data);
      indexDoc = {
        id: data["rows"][0]["id"],
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
      console.log("Index doc: ", indexDoc);
      await addToIndex(indexDoc);
      return res.json({ data: { question: { ...data.rows[0] } } });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error." });
    }
  } catch (error) {
    console.log("Could not fetch user info");
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
    console.log("Returned after updation", data.rows);

    if (data.rows.length === 0) {
      return res.status(404).json({
        error:
          "Question not found or current user doesn't have permission to modify the question",
      });
    } else {
      try {
        const indexData = await esClient.get({
          index: "myindex",
          id: parseInt(req.params.id),
        });
        const indexDoc = {
          id: parseInt(req.params.id),
          description: req.body.description,
          title: req.body.title,
          created_at: indexData["_source"]["created_at"],
          status: indexData["_source"]["status"],
          upvotes: indexData["_source"]["upvotes"],
          downvotes: indexData["_source"]["downvotes"],
          owner: indexData["_source"]["owner"],
          first_name: indexData["_source"]["first_name"],
          last_name: indexData["_source"]["last_name"],
          email: indexData["_source"]["email"],
          answers: indexData["_source"]["answers"],
        };
        updateToIndex(indexDoc);
        console.log("Index data: ", indexData);
        return res.json({ data: { question: { ...data.rows[0] } } });
      } catch (error) {
        console.log(error);
      }
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
      try {
        const res = await removeFromIndex(req.params.id);
        console.log(res);
      } catch (error) {
        return res.json({ msg: "Could not delete index" });
      }
      return res.json({ data: "Question deleted successfully" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};
