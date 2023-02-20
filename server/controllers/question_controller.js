const client = require("../db/connect");

exports.retrieveQuestions = async (req, res) => {
    // Pagination logic
    // Page size is defaulted to 10
    let questionsPerPage = 10;
    let page = parseInt(req.query.page) || 1;
    let offset = (page - 1) * questionsPerPage;

    // Also send the owner's name along with the question
    let query =
		`select q.*, concat(u.first_name, ' ', u.last_name) as name, u.email from Question q join Users u on q.owner = u.id LIMIT $1 OFFSET $2`;

	// let query = "select * from Question LIMIT $1 OFFSET $2";
	try {
		const data = await client.query(query, [questionsPerPage, offset]);
		return res.json({ data: { questions: data.rows } });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: "Internal Server Error." });
	}
};

exports.retrieveQuestionById = async (req, res) => {
	res.send("retrieveQuestionById");
};

exports.createQuestion = async (req, res) => {
	let query =
		"insert into Question (title, description, owner, upvotes, downvotes, created_at, status) values ($1, $2, $3, $4, $5, $6, $7) returning *";
	let values = [
		req.body.title,
		req.body.description,
		req.user.id,
		0,
		0,
		new Date(),
		"OPEN",
	];

	try {
		const data = await client.query(query, values);
		return res.json({ data: { question: { ...data.rows[0] } } });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: "Internal Server Error." });
	}
};

exports.updateQuestion = async (req, res) => {
	let query =
		"update Question set title = $1, description = $2, status = $5 where id = $3 and owner = $4 returning *";
	let values = [
		req.body.title,
		req.body.description,
		parseInt(req.params.id),
		req.user.id,
        req.body.status,
	];

	try {
		const data = await client.query(query, values);
		if (data.rows.length === 0) {
			return res.status(404).json({
				error: "Question not found or current user doesn't have permission to modify the question",
			});
		} else {
			return res.json({ data: { question: { ...data.rows[0] } } });
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: "Internal Server Error." });
	}
};

exports.deleteQuestion = async (req, res) => {
	let query = "delete from Question where id = $1 and owner = $2 returning *";
	let values = [parseInt(req.params.id), req.user.id];

	try {
		const data = await client.query(query, values);
		if (data.rows.length === 0) {
			return res
				.status(404)
				.json({
					error: "Question not found or current user doesn't have permission to delete the question",
				});
		} else {
			return res.json({ data: "Question deleted successfully" });
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: "Internal Server Error." });
	}
};
