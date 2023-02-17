const client = require("../db/connect");
const generateUserToken = require("../utils/userToken");
exports.login = async (req, res) => {
	let text = "select * from Users where email = $1";
	let values = [req.body?.email?.toLowerCase()];
	try {
		const data = await client.query(text, values);
		if (data.rowCount === 1) {
			const auth = await bcrypt.compare(
				req.body.password,
				data.rows[0].password
			);
			if (auth) {
				const token = await generateUserToken(data.rows[0].id);
				const user = data.rows[0];
				delete user.password;
				return res.json({
					data: [token, user],
				});
			} else {
				return res
					.status(403)
					.json({ error: "email and password does not match" });
			}
		} else {
			return res.status(404).json({ error: "No user Found" });
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: "Internal Server Error." });
	}
};

exports.signup = async (req, res) => {
	let text =
		"insert INTO Users(first_name, last_name, email, phone_number, password, reputation, dp_url, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, first_name, last_name, email, phone_number, reputation, dp_url, created_at, updated_at";
	const timestamp = new Date();
	const encryptedPassword = await bcrypt.hash(req.body.password, 10);
	let reputation = 0;
	let values = [
		req.body.first_name,
        req.body.last_name,
		req.body.email.toLowerCase(),
        req.body.phone_number,
		encryptedPassword,
        reputation,
        req.body.dp_url,
		timestamp,
		timestamp,
	];
	try {
		const data = await client.query(text, values);
		const token = await generateUserToken(data.rows[0].id);
		res.json({ data: { token: token, user: { ...data.rows[0] } } });
	} catch (err) {
		console.log(err);
		const duplicateError = err.message.split(" ").pop().replaceAll('"', "");
		if (duplicateError === "users_email_key") {
			res.status(409).json({
				error: "User with this email already exists",
			});
		} else if (duplicateError === "users_phone_number_key") {
			res.status(409).json({
				error: "User with this mobile_number already exists",
			});
		} else {
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
	res.send("Signup");
};

exports.logout = async (req, res) => {
	res.send("Logout");
};

exports.profile = async (req, res) => {
	res.send("Profile");
};
