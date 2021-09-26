import React from "react";
import { Fragment } from "react";

import Auth from "../src/user/pages/Auth"; 
import PostsList from "./post/components/PostsList";

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

const App = () => {
  return (
    <Fragment>
      <PostsList />
    </Fragment>
  );
};

export default App;
