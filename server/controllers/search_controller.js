const client = require("../db/connect");
const { Client } = require("@elastic/elasticsearch");
// const elasticsearch = require("@elastic/elasticsearch");
// const { client: pgClient } = require("../db/connect");

const phraseSearch = async (_index, _type, phrase) => {
  try {
    console.log("els HOST: ", process.env.ELASTICSEARCH_HOST);
    // const { rows } = await pgClient.query(`
    const { rows } = await client.query(`
    SELECT id, description FROM Question
  `);

    console.log("ROWS: ", rows);
    console.log("phrase: ", phrase);
    console.log("index: ", _index);
    console.log("type: ", _type);

    const esClient = new Client({
      cloud: {
        id: "Dev2Dev:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyQ5ODE1ZDg4OWI0OWI0YWFmOGY2MTVhOGI0OWVkMWMyMCQ5YzE3NmRiNDk4Mjg0MDhiYjA1ZWZmNjU3MWRlYTRhYQ==",
      },
      auth: {
        username: "elastic",
        password: "JsEXi8h70TDJFieqd7e9JNz6",
      },
      log: "error",
    });

    try {
      await esClient.bulk({
        body: rows.flatMap((row) => [
          { index: { _index: "myindex", _id: row.id } },
          { name: row.name, description: row.description },
        ]),
      });
    } catch (error) {
      console.log("Didnt bulk");
    }

    hits = [];

    const searchResult = await esClient.search({
      index: _index,
      type: _type,
      body: {
        query: {
          multi_match: {
            fields: ["description"],
            query: phrase,
            type: "phrase_prefix",
          },
        },
        highlight: {
          fields: {
            description: {},
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
