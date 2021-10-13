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
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const NewPost = (props) => {
  const ctx = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      post: {
        value: "",
        isValid: false,
      },
      post_image: {
        value: undefined,
        isValid: true,
      },
    },
    false
  );
  const submitPostHandler = async () => {
    console.log(formState.inputs.post_image.value);

    const postData = new FormData();
    postData.append("user_id", ctx.userId);
    postData.append("post", formState.inputs.post.value);
    if (formState.inputs.post_image.value) {
      postData.append("post_image", formState.inputs.post_image.value);
    }
     const post = { user_id: ctx.userId, post: formState.inputs.post.value };
    try {
      if (formState.inputs.post_image.value) {
        console.log('123123') ; 
        await sendRequest(
          "http://localhost:5000/api/posts/newWithPhoto",
          "POST",
          postData
        );
      } else {
        console.log('hereeee') ; 
        await sendRequest(
          "http://localhost:5000/api/posts/new",
          "POST",
          JSON.stringify(post),
          {"Content-Type":"application/json"}
        );
      }
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
          <ImageUpload id="post_image" center onInput={inputHandler} />
        </div>
      </div>
      <div className={classes.postCont}>
        <button
          className={classes.post}
          disabled={!formState.isValid}
          onClick={submitPostHandler}
        >
          POST
        </button>
      </div>
    </Card>
  );
};

export default NewPost;
