// import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import TopQuestions from "./components/TopQuestions";
import AuthPage from "./AuthPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/auth/signup">
            <AuthPage />
          </Route>
          <Route exact path="/auth/login">
            <AuthPage />
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
