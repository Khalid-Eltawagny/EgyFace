import React from "react";

import Card from "../../shared/components/UIElements/Card";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useContext } from "react";
import Input from "../../shared/components/FormElements/Input";
import classes from "./NewPost.module.css";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useHttpClient } from "../../shared/hooks/use-http";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const NewPost = (props) => {
  const ctx = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      post: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const submitPostHandler = async () => {
    const post = { user_id: ctx.userId, post: formState.inputs.post.value };
    try {
       await sendRequest(
        "http://localhost:5000/api/posts/new",
        "POST",
        JSON.stringify(post),
        { "Content-Type": "application/json" }
      );
    } catch (error) {
      console.log(error);
    }
    props.refresh(ctx.userId);
  };
  return (
    <Card className={classes.card}>
      <div className={classes.input}>
        {isLoading && <LoadingSpinner />}
        <Input
          element="input"
          id="post"
          type="text"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a post"
          placeholder="What's on your mind ? "
          onInput={inputHandler}
        />
      </div>
      <div className={classes.actions}>
        <div>
          <button className={classes.addPhoto}>ADD PHOTO</button>
        </div>
        <div>
          <button className={classes.post} onClick={submitPostHandler}>
            POST
          </button>
        </div>
      </div>
    </Card>
  );
};

export default NewPost;
