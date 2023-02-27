import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { authCheck } from "../AuthChecker";
import { getQuestionsUrl, answerUrl } from "../constants/urls";
import formattedDate from "../utils/dateFormattor";
import Axios from "axios";
import Cookies from "universal-cookie";

// const DisplayQuestionAndAnswers = ({ question }) => {
//     return (
// <div className="flex flex-col mx-auto w-2/3">
//     <div className="justify-start content-start items-start">
//         <div className="flex flex-col">
//             <div className="flex flex-row justify-between">
//                 <div className="flex flex-col">
//                     <div className="flex flex-row">
//                         <div className="text-2xl font-bold">
//                             {question.title}
//                         </div>
//                     </div>
//                     <div className="flex flex-row">
//                         <div className="text-sm text-gray-500">
//                             {question.description}
//                         </div>
//                     </div>
//                 </div>
//                 <div className="flex flex-col">
//                     <div className="flex flex-row">
//                         <div className="text-sm text-gray-500">
//                             {question.answers.length} Answers
//                         </div>
//                     </div>
//                     <div className="flex flex-row">
//                         <div className="text-sm text-gray-500">
//                             {question.views} Views
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className="flex flex-row justify-between">
//                 <div className="flex flex-row">
//                     <div className="text-sm text-gray-500">
//                         Asked {question.createdAt}
//                     </div>
//                 </div>
//                 <div className="flex flex-row">
//                     <div className="text-sm text-gray-500">
//                         {question.tags.map((tag) => (
//                             <div className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
//                                 {tag}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
// </div>
//     );
// }

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

	useEffect(() => {
		fetchAnswersByQuestionId(id).then((data) => setAnswers(data));
		fetchQuestionById(id).then((data) => setQuestion(data));
	}, []);

    const addAnswer = async () => {
        if (!authCheck()) {
            alert("Please Login to answer");
            return;
        }

        const cookies = new Cookies();

        const status = await cookies.get("jwt_authorization");

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
			fetchAnswersByQuestionId(id).then((data) => setAnswers(data));
			alert("Answer Added Succesfully");
		});
    }

	return (
		<div className="px-12 py-5">
			<div className="border border-gray-200 shadow-lg rounded-lg p-6 mb-1 px-12">
				<div className="flex items-center mb-2">
					<h2 className="text-lg font-medium text-gray-900 mr-2">
						{question.title}
					</h2>
					<span
						className={`rounded-full px-2 py-1 text-xs font-medium mr-2 bg-green-100 text-green-800`}
					>
						{question.status}
					</span>
				</div>
				<p className="text-gray-700 mb-2 flex">
					{question.description}
				</p>
				<div className="flex items-center justify-between">
					<p className="text-gray-600 text-xs">
						{question.email} • Posted on{" "}
						{formattedDate(question.created_at)}
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

			<div className="flex flex-col mt-4">
				<div className="flex flex-row">
					<div className="text-sm text-gray-500">
						{answers.length} Answers
					</div>
				</div>
			</div>

			{/* Map through Answers and display them Answers has description upvote downvote created_at and name email*/}
			{answers.map((answer) => (
				<div className="border border-gray-200 shadow-lg rounded-lg p-6 mb-1 px-12">
					<div className="flex items-center mb-2">
						<h2 className="text-lg font-medium text-gray-900 mr-2">
							{answer.description}
						</h2>
					</div>
					<div className="flex items-center justify-between">
						<p className="text-gray-600 text-xs">
							{answer.email} • Posted on{" "}
							{formattedDate(answer.created_at)}
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
									{answer.upvotes}
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
									{answer.downvotes}
								</span>
							</button>
						</div>
					</div>
				</div>
			))}

			{/* Display the form to add an answer */}
			<div className="border border-gray-200 shadow-lg rounded-lg p-6 mb-1 px-12">
				<div className="flex flex-col">
					<div className="flex flex-row">
						<div className="text-sm text-gray-500">Add Answer</div>
					</div>
					<div className="flex flex-col my-4">
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
									className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
									type="button"
									onClick={addAnswer}
								>
									Add Answer
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DisplayQuestionAndAnswers;
