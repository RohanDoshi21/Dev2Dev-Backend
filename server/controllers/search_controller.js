const client = require("../db/connect");
const esClient = require("../db/elastic_connect");
// const elasticsearch = require("@elastic/elasticsearch");
// const { search } = require("@elastic/elasticsearch");
// const { client: pgClient } = require("../db/connect");

const phraseSearch = async (_index, _type, phrase) => {
  try {
    // const { rows } = await client.query(`
    // SELECT Question.*, Users.first_name, Users.last_name, Users.email
    // FROM Question
    // INNER JOIN Users
    // ON Question.owner = Users.id
    // WHERE Question.owner = Users.id
    // `);
    const { rows } = await client.query(`
    SELECT Question.*, Users.first_name, Users.last_name, Users.email,
    string_agg(Answer.description,': ') AS answers
    FROM Question
    INNER JOIN Users
    ON Question.owner = Users.id
    INNER JOIN Answer
    ON Answer.question_id = Question.id
    GROUP BY Question.id, Users.first_name, Users.last_name, Users.email
    `);

    console.log("ROWS: ", rows);

    const index = "myindex";

    try {
      await esClient.bulk({
        body: rows.flatMap((row) => [
          { index: { _index: index, _id: row.id } },
          {
            name: row.name,
            description: row.description,
            title: row.title,
            created_at: row.created_at,
            status: row.status,
            upvotes: row.upvotes,
            downvotes: row.downvotes,
            owner: row.owner,
            first_name: row.first_name,
            last_name: row.last_name,
            email: row.email,
            answers: row.answers,
          },
        ]),
      });
      console.log("BULKED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    } catch (error) {
      console.log("Didnt bulk");
      console.log(error);
    }

    hits = [];

    const searchResult = await esClient.search({
      index: index,
      type: _type,
      body: {
        query: {
          multi_match: {
            fields: ["description", "title", "answers"],
            query: phrase,
            type: "phrase_prefix",
          },
        },
        // _source: [
        //   "description",
        //   "title",
        //   "first_name",
        //   "last_name",
        //   "name",
        //   "created_at",
        //   "status",
        //   "upvotes",
        //   "downvotes",
        //   "owner",
        //   "email",
        // ],
        highlight: {
          fields: {
            description: {},
            title: {},
            answers: {},
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
