import Header from "./Header";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchURL } from "../constants/urls";
import arrrowUp from "../assets/up-arrow.png";
import arrrowDown from "../assets/down-arrow.png";

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
    console.log(searchURL + query);
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
        <Link
          to={`/question/${question._id}`}
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
                  {question["_source"].upvotes}
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
                  {question["_source"].downvotes}
                </span>
              </button>
            </div>
            <div className="flex flex-col gap-3 mb-2">
              <div className="items-start justify-start text-start">
                <div className="flex flex-row">
                  <h2 className="text-lg font-medium text-[#2C74B3] text-bold mr-2">
                    {question["_source"].title}
                    <span
                      className={`${
                        question["_source"].status === "OPEN"
                          ? "bg-[#a6f1c6] text-[#15452a]"
                          : "bg-[#fb919d] text-[#bc3646]"
                      } pb-1  mx-2 rounded-full px-2 py-1 text-xs font-medium`}
                    >
                      {question["_source"].status}
                    </span>
                  </h2>
                </div>
                <div className="text-gray-700 mb-2">
                  {question["_source"].description}
                </div>
              </div>
              <div className="text-gray-600 text-end items-end justify-end text-xs absolute bottom-3 right-5">
                {question["_source"].email} • Posted on{" "}
                {formatedDate(question["_source"].created_at)}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SearchPage;
