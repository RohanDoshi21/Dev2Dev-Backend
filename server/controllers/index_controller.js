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
  try {
    await esClient.indices.create({ index: index });
    return res.json({ msg: "Index Created" });
  } catch (error) {
    return res.json({ msg: "Index cannot be created" });
  }
};

exports.addToIndex = async (indexDoc) => {
  console.log("Adding index");
  const doc = {
    index: "myindex",
    id: indexDoc["id"],
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
};

exports.updateToIndex = async (indexDoc) => {
  try {
    await this.removeFromIndex(indexDoc["id"]);
    await this.addToIndex(indexDoc);
  } catch (error) {
    console.log(error);
  }
};

exports.removeFromIndex = async (id) => {
  esClient.delete(
    {
      index: "myindex",
      id: id,
    },
    (err, result) => {
      if (err) {
        console.error(err);
      } else {
        console.log(result);
      }
    }
  );
};
