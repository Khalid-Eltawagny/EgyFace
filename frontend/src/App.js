import React from "react";
import { Fragment } from "react";

import Auth from "./pages/Auth";

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

const App = () => {
  return (
    <Fragment>
      <Auth />
    </Fragment>
  );
};

export default App;
