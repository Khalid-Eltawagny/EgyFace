import React from "react";
import { Fragment } from "react";

import Input from "../shared/components/FormElements/Input";
import Card from "../shared/components/UIElements/Card";

import classes from "./Auth.module.css";
const Auth = () => {
  return (
    <Fragment>
      <div className={classes.container}>
        <div className={classes.info}>
          <h1 className={classes.header}>teezBook</h1>
          <p className={classes.para}>
            TeezBook helps you connect and share with the people in your life.
          </p>
        </div>
        <div className={classes.form}>
          <Card>
            <form>
              <input placeholder="Enter your email address." />
              <input placeholder="Enter your password." />
              <button >Log In</button>
              <div className={classes.line}></div>
              <button className={classes.newAcc}>Create New Account</button>
            </form>
          </Card>
        </div>
      </div>
    </Fragment>
  );
};

export default Auth;
