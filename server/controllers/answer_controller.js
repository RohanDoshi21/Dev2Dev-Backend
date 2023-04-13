const client = require("../db/connect");
const esClient = require("../db/elastic_connect");
const { addToIndex, updateToIndex } = require("./index_controller");

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
    // console.log("Data wanted: ", data);

    try {
      const indexData = await esClient.get({
        index: "myindex",
        id: parseInt(req.body.question),
      });
      const answer =
        indexData["_source"]["answers"] != null
          ? indexData["_source"]["answers"] + " : " + req.body.description
          : req.body.description;
      console.log("New anser: ", answer);
      const indexDoc = {
        id: parseInt(req.body.question),
        description: req.body.description,
        title: indexData["_source"]["title"],
        created_at: indexData["_source"]["created_at"],
        status: indexData["_source"]["status"],
        upvotes: indexData["_source"]["upvotes"],
        downvotes: indexData["_source"]["downvotes"],
        owner: indexData["_source"]["owner"],
        first_name: indexData["_source"]["first_name"],
        last_name: indexData["_source"]["last_name"],
        email: indexData["_source"]["email"],
        answers: answer,
      };
      updateToIndex(indexDoc);
      console.log("Updating index with this: ", indexDoc);
    } catch (error) {}

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
    const answerData = await client.query(`SELECT * FROM Answer WHERE id=$1`, [
      parseInt(req.params.id),
    ]);
    console.log("Answer data: ", answerData);
    const data = await client.query(query, values);
    if (data.rows.length === 0) {
      return res.status(404).json({
        error:
          "Answer not found or current user doesn't have permission to modify the answer",
      });
    } else {
      try {
        const indexData = await esClient.get({
          index: "myindex",
          id: parseInt(req.body.question),
        });
        const answer =
          indexData["_source"]["answers"] == null
            ? req.body.description
            : indexData["_source"]["answers"].replace(
                answerData["rows"][0]["description"],
                req.body.description
              );
        const indexDoc = {
          id: parseInt(req.params.id),
          description: req.body.description,
          title: indexData["_source"]["title"],
          created_at: indexData["_source"]["created_at"],
          status: indexData["_source"]["status"],
          upvotes: indexData["_source"]["upvotes"],
          downvotes: indexData["_source"]["downvotes"],
          owner: indexData["_source"]["owner"],
          first_name: indexData["_source"]["first_name"],
          last_name: indexData["_source"]["last_name"],
          email: indexData["_source"]["email"],
          answers: answer,
        };
        updateToIndex(indexDoc);
        console.log("Updating index with this: ", indexDoc);
      } catch (error) {}

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
    const answerData = await client.query(`SELECT * FROM Answer WHERE id=$1`, [
      parseInt(req.params.id),
    ]);
    const data = await client.query(query, values);
    if (data.rows.length === 0) {
      return res.status(404).json({
        error:
          "Answer not found or current user doesn't have permission to delete the answer",
      });
    } else {
      try {
        const indexData = await esClient.get({
          index: "myindex",
          id: parseInt(req.body.question),
        });
        console.log("Index data before: ", indexData["_source"]);
        const answer = indexData["_source"]["answers"].replace(
          answerData["rows"][0]["description"],
          " "
        );
        if (answer == "") answer = null;
        const indexDoc = {
          id: parseInt(req.params.id),
          description: req.body.description,
          title: indexData["_source"]["title"],
          created_at: indexData["_source"]["created_at"],
          status: indexData["_source"]["status"],
          upvotes: indexData["_source"]["upvotes"],
          downvotes: indexData["_source"]["downvotes"],
          owner: indexData["_source"]["owner"],
          first_name: indexData["_source"]["first_name"],
          last_name: indexData["_source"]["last_name"],
          email: indexData["_source"]["email"],
          answers: answer,
        };
        updateToIndex(indexDoc);
        console.log("Updating deleted index with this: ", indexDoc);
      } catch (error) {}

      return res.json({ data: { answer: { ...data.rows[0] } } });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};
