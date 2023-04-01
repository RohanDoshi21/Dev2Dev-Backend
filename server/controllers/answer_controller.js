const client = require("../db/connect");
const { addToIndex } = require("./index_controller");

exports.retrieveAnswerForQuestion = async (req, res) => {
  // Add owener's name and email to the answer
  let query = `select a.*, concat(u.first_name, ' ', u.last_name) as name, u.email from Answer a join Users u on a.owner = u.id where a.question_id = $1`;
  // let query = "select * from Answer where question_id = $1";
  let values = [parseInt(req.params.id)];

  try {
    const data = await client.query(query, values);
    return res.json({ data: { answers: data.rows } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

exports.createAnswer = async (req, res) => {
  let query =
    "insert into Answer (description, owner, question_id, upvotes, downvotes, created_at) values ($1, $2, $3, $4, $5, $6) returning *";
  let values = [
    req.body.description,
    req.user.id,
    parseInt(req.body.question),
    0,
    0,
    new Date(),
  ];

  try {
    const data = await client.query(query, values);
    addToIndex(values);
    return res.json({ data: { answer: { ...data.rows[0] } } });
  } catch (err) {
    const ErrorMessage = err.message.split(" ").pop().replaceAll('"', "");
    if (ErrorMessage === "answer_question_id_fkey") {
      return res.status(404).json({ error: "Question not found." });
    }
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

exports.updateAnswer = async (req, res) => {
  let query =
    "update Answer set description = $1 where id = $2 and owner = $3 returning *";
  let values = [req.body.description, parseInt(req.params.id), req.user.id];

  try {
    const data = await client.query(query, values);
    if (data.rows.length === 0) {
      return res
        .status(404)
        .json({
          error:
            "Answer not found or current user doesn't have permission to modify the answer",
        });
    } else {
      return res.json({ data: { answer: { ...data.rows[0] } } });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

exports.deleteAnswer = async (req, res) => {
  let query = "delete from Answer where id = $1 and owner = $2 returning *";
  let values = [parseInt(req.params.id), req.user.id];

  try {
    const data = await client.query(query, values);
    if (data.rows.length === 0) {
      return res
        .status(404)
        .json({
          error:
            "Answer not found or current user doesn't have permission to delete the answer",
        });
    } else {
      return res.json({ data: { answer: { ...data.rows[0] } } });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};
