const { Client } = require("pg");

const configDev = {
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  port: process.env.POSTGRES_PORT,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
};

// Enable SSL for production
const configProd = {
	connectionString: process.env.CONN_STRING,
    ssl: {
        rejectUnauthorized: false
    },
    sslmode: require,
};

var client;

if (process.env.NODE_ENV !== "production") {
     client = new Client(configDev);
} else {
    client = new Client(configProd);
}

client
  .connect()
  .then(() => console.log("connected"))
  .catch((err) => console.error("connection error", err.stack));

module.exports = client;