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
import bgimage from "../src/assets/background.jpg";
import bgimage2 from "../src/assets/bgop2.jpeg";
import { ToastContainer, toast } from "react-toastify";
import SearchPage from "./components/SearchPage";
import MyQuestions from "./components/MyQuestions";

function App() {
  //   const [isLogin, setType] = useState(authCheck());
  // localStorage.removeItem("jwt_authorization");
  //   logOut();

  return (
    <Router>
      <div
        className="App"
        style={{
          backgroundImage: `url(${bgimage2})`,
          height: `100vh`,
          backgroundRepeat: `no-repeat`,
          width: `100wh`,
          backgroundSize: `cover`,
        }}
      >
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
          <Route exact path="/search/results/:query">
            <SearchPage />
          </Route>
          <Route path="/question/:id">
            <Header />
            <DisplayQuestionAndAnswers />
          </Route>
          <Route path="/questions/my_questions/:id">
            <Header />
            <MyQuestions />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
