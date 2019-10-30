import React from "react";
import "./App.css";
import "antd/dist/antd.css";
import Landing from "./Components/Landing/Landing";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import SubmitReviewForm from "./Components/Forms/SubmitReviewForm";
import BookInfo from "./Components/Info/BookInfo";
import EditReviewForm from "./Components/Forms/EditReviewForm";
import CreateBookForm from "./Components/Forms/CreateBookForm";
import LandingTrial from "./Components/Landing/LandingTrial";
import NavBar from "./Components/NavBar";

function App() {
  return (
    <div>
      <Router>
        <div className="App">
          <Route exact path="/" component={Landing}></Route>
          <Route path="/submit" component={SubmitReviewForm}></Route>
          <Route path="/edit" component={EditReviewForm}></Route>
          <Route path="/info" component={BookInfo}></Route>
          <Route path="/createbook" component={CreateBookForm}></Route>
          <Route path="/landingtrial" component={LandingTrial}></Route>
        </div>
      </Router>
    </div>
  );
}

export default App;
