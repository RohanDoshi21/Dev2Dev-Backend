// import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import TopQuestions from "./components/TopQuestions";
import { useState } from "react";
// import { authCheck, logOut } from "./AuthChecker";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import DisplayQuestionAndAnswers from "./components/DisplayQuestionAndAnswers";

import Sample from "./components/Notifications";
import LoginSuccess from "./components/Notifications";

import { ToastContainer, toast } from "react-toastify";

function App() {
  //   const [isLogin, setType] = useState(authCheck());
  // localStorage.removeItem("jwt_authorization");
  //   logOut();
  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <Switch>
          <Route exact path="/auth/signup">
            <SignupForm />
          </Route>
          <Route exact path="/auth/login">
            <LoginForm />
          </Route>
          <Route exact path="/">
            <Header />
            <TopQuestions />
          </Route>
          <Route path="/question/:id">
            <Header />
            <DisplayQuestionAndAnswers />
          </Route>
        </Switch>
      </div>
    </Router>
    // <>
    //   <AuthPage />
    // </>
  );
}

export default App;
