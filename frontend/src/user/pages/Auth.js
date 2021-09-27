import React from "react";
import { Fragment } from "react";
import { useState } from "react";
import { Link } from "react-router-dom"; 


import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import classes from "./Auth.module.css";
const Auth = () => {
  const [isLoginMode, setIsLogInMode] = useState(true);

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const LoginHandler = () => {
    setFormData({
      ...formState.inputs,
      dateOfBirth: undefined,
      name: undefined,
    });
    setIsLogInMode(true);
  };
  const signUpHandler = () => {
    setFormData({
      ...formState.inputs,
      name: {
        value: "",
        isValid: false,
      },
      dateOfBirth: {
        value: "",
        isValid: false,
      },
    });
    setIsLogInMode(false);
  };

  const loginSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  const signUpSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState);
  };

  const checkDate = (event) => {
    formState.inputs.dateOfBirth.value = event.target.value;
    formState.inputs.dateOfBirth.isValid = event.target.value ? true : false;
  };

  return (
    <Fragment>
      <div className={classes.container}>
        <div className={classes.info}>
          <h1 className={classes.header}>teezBook</h1>
          <p className={classes.para}>
            Teezbook helps you connect and share with the people in your life.
          </p>
        </div>
        <div className={classes.form}>
          {!isLoginMode && (
            <Card className={classes.authCard}>
              <div className={classes["signup-info"]}>
                <h2>Sign up</h2>
                <p>it's quick and easy.</p>
              </div>
              <div className={classes.line}></div>
              <form onSubmit={signUpSubmitHandler}>
                <Input
                  element="input"
                  id="name"
                  type="text"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a name."
                  placeholder="Enter your name."
                  onInput={inputHandler}
                />
                <Input
                  element="input"
                  id="email"
                  type="text"
                  validators={[VALIDATOR_EMAIL()]}
                  errorText="Please enter a valid email."
                  placeholder="Enter your email."
                  onInput={inputHandler}
                />
                <Input
                  element="input"
                  id="password"
                  type="password"
                  validators={[VALIDATOR_MINLENGTH(6)]}
                  errorText="Please enter a valid password (at least 6 characters)."
                  placeholder="Enter your password."
                  onInput={inputHandler}
                />
                <input
                  type="date"
                  className={classes.date}
                  style={{ width: "100%" }}
                  onChange={checkDate}
                />
                <div className={classes.line}></div>
                <button
                  type="submit"
                  disabled={!formState.isValid}
                >
                  Create new account
                </button>
                <a>login instead.</a>
              </form>
            </Card>
          )}
          {isLoginMode && (
            <Card>
              <form onSubmit={loginSubmitHandler}>
                <Input
                  element="input"
                  id="email"
                  type="text"
                  validators={[VALIDATOR_EMAIL()]}
                  errorText="Please enter an email."
                  placeholder="Enter your email."
                  onInput={inputHandler}
                />
                <Input
                  element="input"
                  id="password"
                  type="password"
                  validators={[VALIDATOR_MINLENGTH(6)]}
                  errorText="Please enter a valid password (at least 6 character)."
                  placeholder="Enter your password."
                  onInput={inputHandler}
                />
                <button type="submit" disabled={!formState.isValid}>
                  Log In
                </button>
                <div className={classes.line}></div>
                <button className={classes.newAcc} onClick={signUpHandler}>
                  Create New Account
                </button>
              </form>
            </Card>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Auth;
