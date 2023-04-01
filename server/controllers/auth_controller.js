const client = require("../db/connect");
const bcrypt = require("bcryptjs");

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
					data: { token: token, user: user },
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
		return res.json({ data: { token: token, user: { ...data.rows[0] } } });
	} catch (err) {
		const duplicateError = err.message.split(" ").pop().replaceAll('"', "");
		if (duplicateError === "users_email_key") {
			return res.status(409).json({
				error: "User with this email already exists",
			});
		} else if (duplicateError === "users_phone_number_key") {
			return res.status(409).json({
				error: "User with this mobile_number already exists",
			});
		} else {
			return res.status(500).json({ error: "Internal Server Error" });
		}
	}
};

exports.logout = async (req, res) => {
	// Logout and delete the user_token from the database
	let query = "DELETE FROM UsersToken WHERE user_id = $1";
	let values = [req.user.id];
	try {
		const result = await client.query(query, values);
		if (result.rowCount === 0) {
			return res.status(404).json({ error: "User not found." });
		} else {
			return res
				.status(200)
				.json({ message: "User logged out successfully." });
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: "Internal Server Error." });
	}
};

exports.profile = async (req, res) => {
	// Select everything from the user except the hashed password
	let query = "SELECT id, first_name, last_name, email, phone_number, reputation, dp_url, created_at, updated_at FROM Users WHERE id = $1";
	let values = [req.user.id];
	try {
		let data = await client.query(query, values);
		if (data.rowCount === 0) {
			return res.status(404).json({ error: "User not found." });
		} else {
			return res.status(200).json({ data: data.rows[0] });
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: "Internal Server Error." });
	}
};
