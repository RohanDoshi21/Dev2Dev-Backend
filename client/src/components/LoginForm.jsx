import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { loginUrl } from "../constants/urls";

import Cookies from "universal-cookie";
import jwt from "jwt-decode";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setStatus] = useState(false);
  const history = useHistory();
  const cookies = new Cookies();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
    };
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    console.log(loginUrl);
    try {
      const response = await fetch(loginUrl, options);
      const data = await response.json();
      console.log(data);
      const token = data["data"]["token"];
      // console.log(token);
      // cookies.set("jwt_authorization", token);
      localStorage.setItem("jwt_authorization", token);
      localStorage.setItem("username", data["data"]["user"]["first_name"]);
      console.log("stored ", localStorage.getItem("jwt_authorization"));
      toast.success("Logged in!", {
        position: "top-center",
        hideProgressBar: true,
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to login!", {
        position: "top-center",
        hideProgressBar: true,
      });
    } finally {
      history.push("/");
    }
  };

  return (
    // {isLoggedIn && <ToastContainer/>}
    <div>
      {/* <ToastContainer /> */}
      <div className="auth-container">
        <div className="signup-form">
          <h1>LOGIN</h1>
          <form onSubmit={handleSubmit} className="auth-form">
            <label>Email</label>
            <input
              type="email"
              className="auth-input"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Password</label>
            <input
              type="password"
              className="auth-input"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Submit</button>
            <div>
              <h2>
                <a href="/auth/signup">Don't have an account? Sign up</a>
              </h2>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default LoginForm;
