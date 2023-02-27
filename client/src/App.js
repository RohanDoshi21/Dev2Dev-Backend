// import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import TopQuestions from "./components/TopQuestions";
import { useState } from "react";
import { authCheck } from "./AuthChecker";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";

function App() {
  const [isLogin, setType] = useState(authCheck() !== undefined);
  return (
    <Router>
      <div className="App">
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
        </Switch>
      </div>
    </Router>
    // <>
    //   <AuthPage />
    // </>
  );
}

export default App;
