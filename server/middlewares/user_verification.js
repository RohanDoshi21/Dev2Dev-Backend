const client = require("../db/connect");

exports.validateUserData = (req, res, next) => {
  if (Object.values(req.body).length < 5) {
    return res.status(400).json({ error: "One or more field missing" });
  }
  for (let value of Object.values(req.body)) {
    if (!value) {
      return res.status(400).json({ error: "Field Empty" });
    }
  }
  const { email, phone_number, password } = req.body;
  if (
    validateEmail(email) &&
    validateMobileNumber(phone_number) &&
    validatePassword(password)
  ) {
    next();
  } else {
    res.status(400).json({ error: "Invalid Details" });
  }
};

exports.isAuthenticated = async (req, res, next) => {
  try {
    let query = "select * from UsersToken where token = $1";
    const token = req.header("Authorization").replace("Bearer ", "");
    let params = [token];
    const data = await client.query(query, params);
    if (data.rowCount < 1) {
      return res.status(401).json({ error: "Unauthorized user!" });
    }
    const userId = data.rows[0].user_id;
    query =
      "SELECT id, first_name, last_name, email, phone_number, created_at, updated_at, reputation, dp_url from Users where id = $1";
    params = [userId];
    const result = await client.query(query, params);
    if (result.rowCount < 1) {
      return res.status(401).json({ error: "Unauthorized user!" });
    }
    req.user = result.rows[0];
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized user!" });
  }
};

function validateEmail(email) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

function validateMobileNumber(mobile_number) {
  return mobile_number && mobile_number.length >= 10;
}

function validatePassword(password) {
  return password.length >= 8;
}
