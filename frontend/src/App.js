import React from "react";
import { Fragment } from "react";

import Auth from "../src/user/pages/Auth";
import PostsList from "./post/components/PostsList";
import CommentsList from "./post/components/CommentsList";
import FullPost from "../src/post/pages/FullPost";
import Navigation from "./shared/components/Navigation/Navigation";

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

const App = () => {
  return (
    <Fragment>
      <Switch>
        <Route path="/home">
          <Navigation />
          <PostsList />
          <CommentsList />
        </Route>
        <Route path={`/post/:id`} exact>
          <FullPost />
        </Route>
        <Route path="*">
          <Redirect to="/home" />
        </Route>
      </Switch>
      {/* <CommentsList /> */}
    </Fragment>
  );
};

export default App;
