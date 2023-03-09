const client = require("../db/connect");

exports.CreateVoteQuestions = async (req, res) => {
    let query = "insert into VoteQuestion (owner, question_id, vote, created_at) values ($1, $2, $3, $4) returning *";
    let values = [req.user.id, parseInt(req.params.id), parseInt(req.body.vote), new Date()];
    let query2 = "update Question set upvotes = upvotes + $1, downvotes = downvotes + $2 where id = $3 returning *";
    let values2 = [parseInt(req.body.vote) === 1 ? 1 : 0, parseInt(req.body.vote) === -1 ? 1 : 0, parseInt(req.params.id)];
    try {
        const data = await client.query(query, values);
        await client.query(query2, values2);
        return res.json({ data: { vote: { ...data.rows[0] } } });
    } catch (err) {
        const ErrorMessage = err.message.split(" ").pop().replaceAll('"', "");
        if (ErrorMessage === "votequestion_question_id_fkey") {
            return res.status(404).json({ error: "Question not found." });
        }
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error." });
    }
};

exports.UpdateVoteQuestions = async (req, res) => {
    let query = "update VoteQuestion set vote = $1 where id = $2 and owner = $3 returning *";
    let values = [parseInt(req.body.vote), parseInt(req.params.id), req.user.id];

    let query2 = "update Question set upvotes = upvotes + $1, downvotes = downvotes + $2 where id = $3 returning *";
    let values2 = [parseInt(req.body.vote) === 1 ? 1 : 0, parseInt(req.body.vote) === -1 ? 1 : 0, parseInt(req.params.id)];

    try {
        const data = await client.query(query, values);
        await client.query(query2, values2);
        if (data.rows.length === 0) {
            return res.status(404).json({ error: "Vote not found or current user doesn't have permission to modify the vote" });
        }
        else {
            return res.json({ data: { vote: { ...data.rows[0] } } });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error." });
    }
};

exports.CreateVoteAnswers = async (req, res) => {
    let query = "insert into VoteAnswer (owner, answer_id, vote, created_at) values ($1, $2, $3, $4) returning *";
    let values = [req.user.id, parseInt(req.params.id), parseInt(req.body.vote), new Date()];
    let query2 = "update Answer set upvotes = upvotes + $1, downvotes = downvotes + $2 where id = $3 returning *";
    let values2 = [parseInt(req.body.vote) === 1 ? 1 : 0, parseInt(req.body.vote) === -1 ? 1 : 0, parseInt(req.params.id)];

    try {
        const data = await client.query(query, values);
        await client.query(query2, values2);
        return res.json({ data: { vote: { ...data.rows[0] } } });
    } catch (err) {
        const ErrorMessage = err.message.split(" ").pop().replaceAll('"', "");
        if (ErrorMessage === "voteanswer_answer_id_fkey") {
            return res.status(404).json({ error: "Answer not found." });
        }
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}

exports.UpdateVoteAnswers = async (req, res) => {
    let query = "update VoteAnswer set vote = $1 where id = $2 and owner = $3 returning *";
    let values = [parseInt(req.body.vote), parseInt(req.params.id), req.user.id];

    let query2 = "update Answer set upvotes = upvotes + $1, downvotes = downvotes + $2 where id = $3 returning *";
    let values2 = [parseInt(req.body.vote) === 1 ? 1 : 0, parseInt(req.body.vote) === -1 ? 1 : 0, parseInt(req.params.id)];

    try {
        const data = await client.query(query, values);
        await client.query(query2, values2);
        if (data.rows.length === 0) {
            return res.status(404).json({ error: "Vote not found or current user doesn't have permission to modify the vote" });
        }
        else {
            return res.json({ data: { vote: { ...data.rows[0] } } });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}