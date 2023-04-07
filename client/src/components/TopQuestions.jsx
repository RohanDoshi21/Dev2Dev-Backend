import React, { useState, useEffect } from "react";
import { authCheck, config } from "../AuthChecker";
import { getQuestionsUrl } from "../constants/urls";
import Axios from "axios";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import arrrowUp from "../assets/up-arrow.png";
import arrrowDown from "../assets/down-arrow.png";
import { toast, ToastContainer } from "react-toastify";

const fetchTopQuestions = async () => {
	let response = await fetch(getQuestionsUrl);

	const data = await response.json();
	return data["data"]["questions"];
};

const TopQuestions = () => {

    console.log(process.env.NODE_ENV);

    console.log(process.env.BACKEND_BASE_URL);


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
	        toast.warn("You need to be logged in to post a question");
		} else {
			setPostQuestion(true);
		}
	}

	async function postQuestionBackend() {
		const status = localStorage.getItem("jwt_authorization");

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
			//setPostQuestion(false);
			toast.success("Question posted successfully");
		});
	}

	return (
		<div className="flex flex-col mx-36 justify-center items-center  bg-cover ">
			<div className="justify-center items-center w-2/5 flex mt-5 ">
				{postQuestion == false && (
					<button
						onClick={handleOnClick}
						className="bg-[#0A2647] hover:bg-[#2C74B3] text-white font-bold  w-full py-2 px-4 rounded-2xl mb-4 my-3"
					>
						Post a question
					</button>
				)}
			</div>
			{
				// Create a form to post a question
				postQuestion === true && (
					<div className="flex flex-col mx-auto w-3/5 mb-10 p-2">
						<div className="justify-center items-center">
							<button
								onClick={() => {
									setPostQuestion(false);
								}}
								className="bg-[#144272] hover:bg-[#2C74B3] text-white  text-myfont font-bold rounded-2xl w-2/3 py-2 px-4 mb-4 my-3"
							>
								Cancel
							</button>
						</div>
						<div className="flex flex-col mx-auto w-full border-[1px] p-8 rounded-xl shadow-lg">
							<div className="flex flex-col mb-4 align-start justify-start items-start ">
								<label
									className="mb-1 font-normal text-xl text-[#144272] rounded "
									htmlFor="title"
								>
									Title
								</label>
								<input
									className="border py-2 px-3 text-grey-800 w-full rounded"
									type="text"
									name="title"
									id="title"
									placeholder="Enter your question here"
									onChange={(e) => {
										setTitle(e.target.value);
									}}
								/>
							</div>
							<div className="flex flex-col mb-4 align-start justify-start items-start">
								<label
									className="mb-1 font-normal text-xl text-[#144272]"
									htmlFor="description"
								>
									Description
								</label>
								<textarea
									className="border py-2 px-3 text-grey-800 w-full rounded"
									name="description"
									id="description"
									placeholder="Enter the description of your question here"
									cols="30"
									rows="10"
									onChange={(e) => {
										setDescription(e.target.value);
									}}
								></textarea>
							</div>
							<button
								onClick={postQuestionBackend}
								className="bg-[#144272] hover:bg-[#2C74B3] text-white  py-2 px-4 rounded-2xl"
							>
								Post
							</button>
						</div>
					</div>
				)
			}
			{questions.map((question) => (
				<Link
					to={`/question/${question.id}`}
					className="w-full bg-opacity-50 bg-white"
				>
					<div className="border-gray-200 shadow-md border flex flex-row gap-8 rounded-lg p-4 mb-3 relative w-full">
						<div className="flex flex-col items-end  gap-4 justify-center  mr-2  w-[1rem]">
							<button
								className="text-gray-600 hover:text-gray-800 flex  flex-row focus:outline-none focus:text-gray-800"
								aria-label="Upvote"
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
				</Link>
			))}
			<ToastContainer />
		</div>
	);
};

export default TopQuestions;
