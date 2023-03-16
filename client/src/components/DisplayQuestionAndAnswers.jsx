import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { authCheck } from "../AuthChecker";
import {
	getQuestionsUrl,
	answerUrl,
	voteAnswerUrl,
	voteQuestionUrl,
} from "../constants/urls";
import formattedDate from "../utils/dateFormattor";
import Axios from "axios";
import arrrowUp from "../assets/up-arrow.png";
import arrrowDown from "../assets/down-arrow.png";
import { toast, ToastContainer } from "react-toastify";

const fetchQuestionById = async (id) => {
	let response = await fetch(getQuestionsUrl + "/" + id);

	const data = await response.json();
	return data["data"]["question"];
};

const fetchAnswersByQuestionId = async (id) => {
	let response = await fetch(answerUrl + "/" + id);

	const data = await response.json();
	return data["data"]["answers"];
};

const DisplayQuestionAndAnswers = (props) => {
	const { id } = useParams();

	const [question, setQuestion] = useState({});
	const [answers, setAnswers] = useState([]);
	const [addAnswerVariable, setAddAnswerVariable] = useState("");

	function formatedDate(createdAt) {
		const date = new Date(createdAt);
		const formattedDate = `${date.getDate()} ${date.toLocaleString(
			"default",
			{ month: "short" }
		)} ${date.getFullYear()}`;
		return formattedDate;
	}

	useEffect(() => {
		fetchAnswersByQuestionId(id).then((data) => setAnswers(data));
		fetchQuestionById(id).then((data) => setQuestion(data));
	}, []);

	const addAnswer = async () => {
		if (!authCheck()) {
			toast.warning("Please Login to answer");
			return;
		}

		const status = localStorage.getItem("jwt_authorization");

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + status,
			},
		};

		console.log(`posting ${id}`);

		Axios.post(
			answerUrl,
			{
				description: addAnswerVariable,
				question: id,
			},
			config
		).then((response) => {
			console.log(response);
			setAddAnswerVariable("");
			fetchAnswersByQuestionId(id).then((data) => setAnswers(data));
			toast.success("Answer Added Succesfully");
		});
	};

	const addVote = async (kId, vote, type) => {
		if (!authCheck()) {
			toast.error("Please Login to vote");
			return;
		}

		const status = localStorage.getItem("jwt_authorization");

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + status,
			},
		};

		var typeQ = type === "question" ? voteQuestionUrl : voteAnswerUrl;

		Axios.post(
			typeQ + kId,
			{
				vote: vote,
			},
			config
		)
			.then((response) => {
				console.log(response);
                // Update the state of the question and answers
                if (type === "question") {
                    fetchQuestionById(id).then((data) => setQuestion(data));
                } else {
                    fetchAnswersByQuestionId(id).then((data) => setAnswers(data));
                }

				toast.success("Vote Added Succesfully");
			})
			.catch((error) => {
				console.log(error);
				toast.error(error.response.data.error);
			});
	};

	return (
		<div className="mx-36 py-5 bg-opacity-50 bg-white">
			<div className="border-gray-200 shadow-md border flex flex-row gap-8 rounded-lg p-4 mb-3 relative w-full">
				<div className="flex flex-col items-end  gap-4 justify-center  mr-2  w-[1rem]">
					<button
						className="text-gray-600 hover:text-gray-800 flex  flex-row focus:outline-none focus:text-gray-800"
						aria-label="Upvote"
						onClick={() => addVote(question.id, 1, "question")}
					>
						<img
							src={arrrowUp}
							className="h-5 w-5 mx-2"
							alt="up arrow"
						></img>

						<span className="text-xs font-medium">
							{question.upvotes}
						</span>
					</button>
					<button
						className="text-gray-600 hover:text-gray-800 flex flex-row  focus:outline-none focus:text-gray-800"
						aria-label="Downvote"
						onClick={() => addVote(question.id, -1, "question")}
					>
						<img
							src={arrrowDown}
							className="h-5 w-5 mx-2"
							alt="up arrow"
						></img>
						<span className="text-xs font-medium">
							{question.downvotes}
						</span>
					</button>
				</div>
				<div className="flex flex-col gap-3 mb-2">
					<div className="items-start justify-start text-start">
						<div className="flex flex-row">
							<h2 className="text-lg font-medium text-[#2C74B3] text-bold mr-2">
								{question.title}
								<span
									className={`${
										question.status === "OPEN"
											? "bg-[#a6f1c6] text-[#15452a]"
											: "bg-[#fb919d] text-[#bc3646]"
									} pb-1  mx-2 rounded-full px-2 py-1 text-xs font-medium`}
								>
									{question.status}
								</span>
							</h2>
						</div>
						<div className="text-gray-700 mb-2">
							{question.description}
						</div>
					</div>
					<div className="text-gray-600 text-end items-end justify-end text-xs absolute bottom-3 right-5">
						{question.email} • Posted on{" "}
						{formatedDate(question.created_at)}
					</div>
				</div>
			</div>

			<div className="flex flex-col mt-4">
				<div className="flex flex-row">
					<div className="text-base font-medium mb-1 text-gray-500">
						{answers.length} Answers
					</div>
				</div>
			</div>

			{/* Map through Answers and display them Answers has description upvote downvote created_at and name email*/}
			{answers.map((answer) => (
				<div className="border-gray-200 shadow-md border flex flex-row gap-8 rounded-lg p-4 mb-3 relative w-full">
					<div className="flex flex-col items-end  gap-4 justify-center  mr-2  w-[1rem]">
						<button
							className="text-gray-600 hover:text-gray-800 flex  flex-row focus:outline-none focus:text-gray-800"
							aria-label="Upvote"
							onClick={() => addVote(answer.id, 1, "answer")}
						>
							<img
								src={arrrowUp}
								className="h-5 w-5 mx-2"
								alt="up arrow"
							></img>

							<span className="text-xs font-medium">
								{answer.upvotes}
							</span>
						</button>
						<button
							className="text-gray-600 hover:text-gray-800 flex flex-row  focus:outline-none focus:text-gray-800"
							aria-label="Downvote"
							onClick={() => addVote(answer.id, -1, "answer")}
						>
							<img
								src={arrrowDown}
								className="h-5 w-5 mx-2"
								alt="up arrow"
							></img>
							<span className="text-xs font-medium">
								{answer.downvotes}
							</span>
						</button>
					</div>
					<div className="flex flex-col gap-3 mb-2">
						<div className="items-start justify-start text-start">
							<div className="text-gray-700 mb-2">
								{answer.description}
							</div>
						</div>
						<div className="text-gray-600 text-end items-end justify-end text-xs absolute bottom-3 right-5">
							{answer.email} • Posted on{" "}
							{formatedDate(answer.created_at)}
						</div>
					</div>
				</div>
			))}

			{/* Display the form to add an answer */}
			<div className="border border-gray-200 shadow-lg rounded-lg px-8 mb-1 py-3">
				<div className="flex flex-col">
					<div className="flex flex-row">
						<div className="text-base font-medium mb-1 text-gray-500">
							Add an Answer
						</div>
					</div>
					<div className="flex flex-col">
						<div className="text-sm text-gray-500">
							<textarea
								className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
								rows="4"
								placeholder="Enter your answer"
								value={addAnswerVariable}
								onChange={(e) =>
									setAddAnswerVariable(e.target.value)
								}
							/>
						</div>

						<div className="flex flex-row my-2">
							<div className="text-sm text-gray-500">
								<button
									className="bg-[#144272] hover:bg-[#2C74B3] text-white  py-2 px-4 rounded-2xl w-32"
									type="button"
									onClick={addAnswer}
								>
									Submit
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<ToastContainer />
		</div>
	);
};

export default DisplayQuestionAndAnswers;
