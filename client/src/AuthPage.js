import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import SignupForm from "./components/AuthForm";
import LoginForm from "./components/LoginForm";
import { signupUrl } from "./constants/urls";

const AuthPage = () => {
  const [isLogin, setType] = useState(true);
  return (
    // <div className="BlankScreen">
      <div className="auth-container">
        {/* <h1>Auth Window</h1> */}
        !isLogin&& <SignupForm />
        isLogin && <LoginForm></LoginForm> 
      </div>
    // </div>
  );
};

export default AuthPage;
