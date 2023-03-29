const { Client } = require("@elastic/elasticsearch");

const configElastic = {
  cloud: {
    id: process.env.ELASTIC_CLOUD_ID,
  },
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD,
  },
  log: "error",
};

const esClient = new Client(configElastic);

module.exports = esClient;
