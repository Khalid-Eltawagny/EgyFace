import React from "react";
import { Fragment } from "react";

import Navigation from "../Navigation/Navigation";

import classes from "./Layout.module.css";
const Layout = (props) => {
  return (
    <Fragment>
      <div className={classes.container}>
        <Navigation />
      </div>
      {props.children}
    </Fragment>
  );
};

export default Layout;
