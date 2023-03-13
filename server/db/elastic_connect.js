const { Client } = require("@elastic/elasticsearch");

const configElastic = {
  cloud: {
    id: "Dev2Dev:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyQ5ODE1ZDg4OWI0OWI0YWFmOGY2MTVhOGI0OWVkMWMyMCQ5YzE3NmRiNDk4Mjg0MDhiYjA1ZWZmNjU3MWRlYTRhYQ==",
  },
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD,
  },
  log: "error",
};

const esClient = new Client(configElastic);

module.exports = esClient;
