import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { loginUrl } from "../constants/urls";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

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
    } catch (error) {
      console.log(error);
    } finally {
      history.push("/");
    }
  };

  return (
    <div className="signup-form">
      <h1>Auth Page</h1>
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
        <button>Submit</button>
      </form>
    </div>
  );
};
export default LoginForm;
