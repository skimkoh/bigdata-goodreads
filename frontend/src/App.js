import React from "react";
import "./App.css";
import "antd/dist/antd.css";
import Landing from "./Components/Landing/Landing";
import { BrowserRouter as Router, Route, NavLink, Switch } from "react-router-dom";
import SubmitReviewForm from "./Components/Forms/SubmitReviewForm";
import BookInfo from "./Components/Info/BookInfo";
import EditReviewForm from "./Components/Forms/EditReviewForm";
import SubmitBookForm from "./Components/Forms/SubmitBookForm";
import AllBooks from "./Components/AllBooks/AllBooks";
import NotFound from "./Components/NotFound";


function App() {
  return (
    <div>
      <Router>
        <div className="App">
          <Switch>
          <Route exact path="/" component={AllBooks}></Route>
          <Route path="/submit" component={SubmitReviewForm}></Route>
          <Route path="/edit" component={EditReviewForm}></Route>
          <Route path="/info" component={BookInfo}></Route>
          <Route path="/booksubmit" component={SubmitBookForm}></Route>
          {/* <Route path="/books" component={AllBooks}></Route> */}
          <Route path="*" exact={true} component={NotFound}></Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
