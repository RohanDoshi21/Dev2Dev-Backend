import React, { useContext, useEffect, useState } from "react";
import Logo from "../assets/logo_bg.png";
import Cookies from "universal-cookie";
import { useHistory } from "react-router-dom";

import { authCheck, logOut } from "../AuthChecker";
import { profileUrl } from "../constants/urls";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  // const isAuthenticated = authCheck();
  let [isAuthenticated, setAuth] = useState(authCheck());
  let [query, setQuery] = useState("");
  const history = useHistory();
  // console.log("Acc status ", isAuthenticated);
  // const isAuthenticated = authCheck();
  const userName = localStorage.getItem("username");
  const userId = localStorage.getItem("userID");

  console.log("Acc status ", userId);

  const handleLogout = async () => {
    try {
      const data = logOut();
      console.log(data);
      // if (data?.error) {
      //   console.log(data.error);
      // } else
      setAuth(false);
      toast.success("Logged out!", {
        position: "top-center",
        hideProgressBar: true,
      });
    } catch (e) {
      toast.error("Failed to logout", {
        position: "top-center",
        hideProgressBar: true,
      });
      console.log(e);
    }
  };

  const handleSearch = () => {
    const q = query.replace(" ", "+");
    history.push(`/search/results/${q}`);
  };

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      console.log("Enter pressed");
      handleSearch();
    }
  };

  return (
    <div>
      <ToastContainer />
      <header className="flex justify-between items-center py-2 px-4 bg-[#0A2647] h-16 text-gray-100">
        {/* Logo */}
        <div className="logo">
          <a href="/">
            <img
              src={Logo}
              alt="Stack Overflow logo"
              className="h-12 w-40 p-2"
            />
          </a>
        </div>

        {/* Search bar */}
        <div className="flex-1 mx-4">
          <div className="relative">
            <input
              className="block w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 placeholder-gray-500 text-gray-100 focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
              type="text"
              placeholder="Search..."
              value={query}
              onChange={handleChange}
              onClick={() => {
                console.log(query);
              }}
              onKeyDown={handleKeyDown}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22 22l-6-6" />
                <circle cx="10" cy="10" r="8" />
              </svg>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1">
          <ul className="flex justify-end ">
            <li className="mr-4">
              {isAuthenticated && (
                <a
                  className="hover:text-blue-500"
                  href={`/questions/my_questions/${userId}`}
                >
                  My Questions
                </a>
              )}
            </li>
            <li className="mr-4">
              <a className="hover:text-blue-500" href="#">
                Tags
              </a>
            </li>
            <li className="mr-4">
              <a className="hover:text-blue-500" href="#">
                Users
              </a>
            </li>
            <li className="mr-4">
              {!isAuthenticated && (
                <a className="hover:text-blue-500" href="/auth/login">
                  Login
                </a>
              )}
            </li>
            <li className="mr-4">
              {isAuthenticated && (
                <a
                  className="hover:text-blue-500"
                  href="/"
                  onClick={handleLogout}
                >
                  Logout
                </a>
              )}
            </li>
          </ul>
        </nav>

        {/* User profile information */}
        <div className="user-profile flex items-center mx-2">
          {isAuthenticated && (
            <img
              className="rounded-full h-8 w-8 mr-2"
              src="https://via.placeholder.com/50x50"
              alt="User profile"
            />
          )}
          {isAuthenticated && (
            <span className="text-gray-300 text-sm font-medium">
              {userName}{" "}
            </span>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
