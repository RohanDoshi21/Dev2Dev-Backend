const client = require("../db/connect");
const esClient = require("../db/elastic_connect");
// const elasticsearch = require("@elastic/elasticsearch");
// const { search } = require("@elastic/elasticsearch");
// const { client: pgClient } = require("../db/connect");

const phraseSearch = async (_index, _type, phrase) => {
  try {
    hits = [];
    let index = "myindex";
    // const indexData = await esClient.get({
    //   index: "myindex",
    //   // id: parseInt(),
    // });
    // console.log("Searching in this: ", indexData);
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
