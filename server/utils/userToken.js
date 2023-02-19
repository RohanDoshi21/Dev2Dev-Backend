const client = require("../db/connect");
const jwt = require("jsonwebtoken");

const generateUserToken = async (userId) => {
  console.log(userId);
  try {
    const timestamp = new Date();
    const token = jwt.sign({ id: userId }, process.env.TOKEN_SECRET);
    let tokenRecord =
      "insert into UsersToken(token, is_valid, user_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)";
    let tokenValues = [token, true, userId, timestamp, timestamp];
    await client.query(tokenRecord, tokenValues);
    return token;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = generateUserToken;
