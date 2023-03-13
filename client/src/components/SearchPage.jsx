import Header from "./Header";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchURL } from "../constants/urls";

const fetchQuestions = async (query) => {
  try {
    let response = await fetch(searchURL + query);
    console.log(searchURL + query);
    const data = await response.json();
    // await setQuestions(data);
    console.log("Data: ", data);
    console.log("On query: ", query);
    // console.log("Questions: ", questions);
    return data["hits"];
  } catch (error) {
    console.log(error);
  }
};

const SearchPage = (props) => {
  const { query } = useParams();
  const [questions, setQuestions] = useState([]);
  // let questions = [];
  console.log("Query: ", query);

  useEffect(() => {
    fetch(searchURL + query)
      .then((response) => response.json())
      .then((data) => setQuestions(data["hits"]))
      .catch((error) => console.error(error));
    console.log("In useEffect", questions);
  }, []);

  function formatedDate(createdAt) {
    const date = new Date(createdAt);
    const formattedDate = `${date.getDate()} ${date.toLocaleString("default", {
      month: "short",
    })} ${date.getFullYear()}`;
    return formattedDate;
  }

  console.log("Inside search page", questions);

  return (
    <div>
      <Header />
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
            <p className="text-gray-700 mb-2">{question.description}</p>
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-xs">
                {question.email} • Posted on {formatedDate(question.created_at)}
              </p>
              <div className="flex items-center">
                <button
                  className="mr-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800"
                  aria-label="Upvote"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
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
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
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

export default SearchPage;
