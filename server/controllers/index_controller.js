const client = require("../db/connect");
const esClient = require("../db/elastic_connect");

exports.deleteIndex = async (req, res) => {
  console.log("Resetting");
  index = "myindex";
  try {
    await esClient.indices.delete({
      index: index,
    });
    return res.json({ msg: "Deleted index" });
  } catch (error) {
    console.log("Index does not exist!!!!!");
    return res.json({ msg: "Index does not exist!" });
  }
};

exports.createIndex = async (req, res) => {
  // try {
  // index = req.body.indexName;
  // const { rows } = await client.query(`
  // SELECT Question.*, Users.first_name, Users.last_name, Users.email,
  // string_agg(Answer.description,': ') AS answers
  // FROM Question
  // INNER JOIN Users
  // ON Question.owner = Users.id
  // LEFT JOIN Answer
  // ON Answer.question_id = Question.id
  // GROUP BY Question.id, Users.first_name, Users.last_name, Users.email
  // `);

  // console.log("ROWS: ", rows);
  // if (rows.length == 0) {
  //   return res.json({ msg: "No data" });
  // }
  try {
    await esClient.indices.create({ index: index });
    return res.json({ msg: "Index Created" });
  } catch (error) {
    return res.json({ msg: "Index cannot be created" });
  }

  // await esClient.bulk({
  //   body: rows.flatMap((row) => [
  //     { index: { _index: index, _id: row.id } },
  //     {
  //       name: row.name,
  //       description: row.description,
  //       title: row.title,
  //       created_at: row.created_at,
  //       status: row.status,
  //       upvotes: row.upvotes,
  //       downvotes: row.downvotes,
  //       owner: row.owner,
  //       first_name: row.first_name,
  //       last_name: row.last_name,
  //       email: row.email,
  //       answers: row.answers,
  //     },
  //   ]),
  // });
  // console.log("BULKED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  // } catch (error) {
  //   console.log("Didnt bulk");
  //   console.log(error);
  //   return res.json({ msg: "Failed" });
  // }
};

exports.addToIndex = async (indexDoc) => {
  console.log("Adding index");
  const doc = {
    index: "myindex",
    body: indexDoc,
  };
  console.log("TO be indexed: ", indexDoc);
  esClient.index(doc, (err, res) => {
    if (err) {
      console.log("ERROR: ", err);
    } else {
      console.log("Indexed: ", res);
    }
  });
  // console.log(values);
  // await esClient.index()`
};

exports.removeFromIndex = async (req, res) => {};
