import React, { useState, useEffect } from "react";
import { authCheck, config } from "../AuthChecker";
import { getQuestionsUrl } from "../constants/urls";
import Axios from "axios";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";

const fetchTopQuestions = async () => {
	let response = await fetch(getQuestionsUrl);

	const data = await response.json();
	return data["data"]["questions"];
};

const TopQuestions = () => {
	const [questions, setQuestions] = useState([]);
	const [postQuestion, setPostQuestion] = useState(false);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	useEffect(() => {
		fetchTopQuestions().then((data) => setQuestions(data));
	}, []);

	function formatedDate(createdAt) {
		const date = new Date(createdAt);
		const formattedDate = `${date.getDate()} ${date.toLocaleString(
			"default",
			{ month: "short" }
		)} ${date.getFullYear()}`;
		return formattedDate;
	}

	function handleOnClick() {
		console.log("clicked");
		if (!authCheck()) {
			alert("You need to be logged in to post a question");
		} else {
			setPostQuestion(true);
		}
	}

	async function postQuestionBackend() {
        const cookies = new Cookies();

        const status = await cookies.get("jwt_authorization");

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + status,
			},
		};

		console.log("posting");
		Axios.post(
			getQuestionsUrl,
			{
				title: title,
				description: description,
			},
			config
		).then((response) => {
			console.log(response);
			fetchTopQuestions().then((data) => setQuestions(data));
			setPostQuestion(false);
			alert("Question posted successfully");
		});
	}

	return (
		<div className="flex flex-col mx-auto w-2/3">
			<div className="justify-start content-start items-start">
				<button
					onClick={handleOnClick}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 w-1/6 items-end justify-start my-3 flex"
				>
					Post a question
				</button>
			</div>
			{
				// Create a form to post a question
				postQuestion === true && (
					<div className="flex flex-col mx-auto w-2/3">
						<div className="justify-start content-start items-start">
							<button
								onClick={() => {
									setPostQuestion(false);
								}}
								className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 w-1/6 items-end justify-start my-3 flex"
							>
								Cancel
							</button>
						</div>
						<div className="flex flex-col mx-auto w-2/3">
							<div className="flex flex-col mb-4">
								<label
									className="mb-2 font-bold text-lg text-gray-700"
									htmlFor="title"
								>
									Title
								</label>
								<input
									className="border py-2 px-3 text-grey-800"
									type="text"
									name="title"
									id="title"
									onChange={(e) => {
										setTitle(e.target.value);
									}}
								/>
							</div>
							<div className="flex flex-col mb-4">
								<label
									className="mb-2 font-bold text-lg text-gray-700"
									htmlFor="description"
								>
									Description
								</label>
								<textarea
									className="border py-2 px-3 text-grey-800"
									name="description"
									id="description"
									cols="30"
									rows="10"
									onChange={(e) => {
										setDescription(e.target.value);
									}}
								></textarea>
							</div>
							<button
								onClick={postQuestionBackend}
								className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
							>
								Post
							</button>
						</div>
					</div>
				)
			}
			{questions.map((question) => (
				<Link to={`/question/${question.id}`}>
					<div className="border border-gray-200 shadow-lg rounded-lg p-4 mb-1">
						<div className="flex items-center mb-2">
							<h2 className="text-lg font-medium text-gray-900 mr-2">
								{question.title}
							</h2>
							<span
								className={`bg-${
									question.status === "OPEN" ? "green" : "red"
								}-500 text-white rounded-full px-2 py-1 text-xs font-medium`}
							>
								{question.status}
							</span>
						</div>
						<p className="text-gray-700 mb-2">
							{question.description}
						</p>
						<div className="flex items-center justify-between">
							<p className="text-gray-600 text-xs">
								{question.email} • Posted on{" "}
								{formatedDate(question.created_at)}
							</p>
							<div className="flex items-center">
								<button
									className="mr-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800"
									aria-label="Upvote"
								>
									<svg
										className="h-5 w-5 fill-current"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M10 3.414l5.657 5.657-1.414 1.414L10 6.243 5.757 10.5 4.343 9.086 10 3.414zM10 16.586l-5.657-5.657 1.414-1.414L10 13.757l4.243-4.243 1.414 1.414L10 16.586z"
											clipRule="evenodd"
										/>
									</svg>
									<span className="text-xs font-medium">
										{question.upvotes}
									</span>
								</button>
								<button
									className="text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800"
									aria-label="Downvote"
								>
									<svg
										className="h-5 w-5 fill-current"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M10 16.586l-5.657-5.657 1.414-1.414L10 13.757l4.243-4.243 1.414 1.414L10 16.586z"
											clipRule="evenodd"
										/>
									</svg>
									<span className="text-xs font-medium">
										{question.downvotes}
									</span>
								</button>
							</div>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
};

export default TopQuestions;
