import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useHttpClient } from "../../shared/hooks/use-http";
import { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { useHistory } from "react-router";

import classes from "./Auth.module.css";
const Auth = () => {
  const history = useHistory();
  const ctx = useContext(AuthContext);
  const [isLoginMode, setIsLogInMode] = useState(true);
  const { sendRequest, isLoading, error, clearError } = useHttpClient();
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
    clearError();
    setFormData({
      ...formState.inputs,
      name: undefined,
      image:undefined
    });
    setIsLogInMode(true);
  };
  const signUpHandler = () => {
    clearError() ;
    setFormData({
      ...formState.inputs,
      name: {
        value: "",
        isValid: false,
      },
      image: {
        value: "",
        isValid: false,
      },
    });
    setIsLogInMode(false);
  };

  const loginSubmitHandler = async (event) => {
    event.preventDefault();
    const user = {
      email: formState.inputs.email.value,
      password: formState.inputs.password.value,
    };
    try {
      clearError();
      const response = await sendRequest(
        "http://localhost:5000/api/users/signin",
        "POST",
        JSON.stringify(user),
        { "Content-Type": "application/json" }
      );
      clearError();
      ctx.login(response.userId, response.token);
      history.push("/home");
    } catch (error) {}
  };

  const signUpSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData() ;
    formData.append("name",formState.inputs.name.value) ; 
    formData.append("email",formState.inputs.email.value) ; 
    formData.append("password",formState.inputs.password.value) ; 
    formData.append("image",formState.inputs.image.value)
    console.log(formState.inputs.image.value) ; 
    const user = {
      name: formState.inputs.name.value,
      email: formState.inputs.email.value,
      password: formState.inputs.password.value,
    };
    try {
      clearError();
      const response = await sendRequest(
        "http://localhost:5000/api/users/signup",
        "POST",
        formData
      );
      clearError();
      ctx.login(response.userId, response.token);
      history.push("/home");
    } catch (error) {}
  };

  return (
    <div className={classes.container}>
      <div className={classes.info}>
        <h1 className={classes.header}>teezBook</h1>
        <p className={classes.para}>
          Teezbook helps you connect and share with the people in your life.
        </p>
      </div>
      <div className={classes.form}>
        {isLoading && <LoadingSpinner />}
        {error && <h1 className={classes.warn}> {error} </h1>}
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
              <ImageUpload
                id="image"
                center
                onInput={inputHandler}
                errorText="please provide an image"
              />
              <div className={classes.line}></div>
              <button
                type="submit"
                disabled={!formState.isValid}
                className={formState.isValid ? classes.newAcc2 : classes.diable}
              >
                Create new account
              </button>
              <Link to="/" onClick={LoginHandler}>login instead</Link>
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
  );
};

export default Auth;
