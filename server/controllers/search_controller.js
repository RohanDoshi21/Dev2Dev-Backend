const client = require("../db/connect");
const esClient = require("../db/elastic_connect");
// const elasticsearch = require("@elastic/elasticsearch");
// const { search } = require("@elastic/elasticsearch");
// const { client: pgClient } = require("../db/connect");

const phraseSearch = async (_index, _type, phrase) => {
  try {
    const { rows } = await client.query(`
    SELECT id, description, title FROM Question
  `);

    console.log("ROWS: ", rows);
    console.log("phrase: ", phrase);
    console.log("index: ", _index);
    console.log("type: ", _type);

    const index = "myindex";

    try {
      // await esClient.indices.delete({
      //   index: index,
      // });
      await esClient.bulk({
        body: rows.flatMap((row) => [
          { index: { _index: index, _id: row.id } },
          { name: row.name, description: row.description, title: row.title },
        ]),
      });
    } catch (error) {
      console.log("Didnt bulk");
    }

    hits = [];

    const searchResult = await esClient.search({
      index: index,
      type: _type,
      body: {
        query: {
          multi_match: {
            fields: ["description", "title"],
            query: phrase,
            type: "phrase_prefix",
          },
        },
        highlight: {
          fields: {
            description: {},
            title: {},
          },
        },
      },
    });

    console.log(searchResult);
    console.log(
      searchResult.hits.hits.forEach((hit, index) =>
        console.log(`${hit._source.description}`)
      )
    );

    if (
      searchResult &&
      searchResult.hits &&
      searchResult.hits.hits &&
      searchResult.hits.hits.length > 0
    ) {
      hits.push(...searchResult.hits.hits);
    }

    return {
      // msg: "Passed",
      hitsCount: hits.length,
      took: searchResult.took,
      hits,
    };
  } catch (error) {
    console.log(error);
    // console.log("FAILED QUERY!!!!!!!!!!!!!!!!!!!!!!");
  }
};

exports.searchQuery = async (req, res) => {
  const data = await phraseSearch(
    req.params.index,
    req.params.type,
    req.query.q
  );
  res.json(data);
};
