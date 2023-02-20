import React, { useState, useEffect } from "react";
import { getQuestionsUrl } from "../constants/urls";

const fetchTopQuestions = async () => {
	let response = await fetch(getQuestionsUrl);

	const data = await response.json();
	return data["data"]["questions"];
};

const TopQuestions = () => {
	const [questions, setQuestions] = useState([]);

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

	return (
		<div className="flex flex-col mx-auto w-2/3">
			{questions.map((question) => (
				<div className="border border-gray-200 shadow-lg rounded-lg p-4 mb-1">
					<div className="flex items-center mb-2">
						<h2 className="text-lg font-medium text-gray-900 mr-2">
							{question.title}
						</h2>
						<span className={`bg-${question.status === 'OPEN' ? "green" : "red"}-500 text-white rounded-full px-2 py-1 text-xs font-medium`}>
							{question.status}
						</span>
					</div>
					<p className="text-gray-700 mb-2">{question.description}</p>
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
			))}
		</div>
	);
};

export default TopQuestions;
