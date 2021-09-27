import React from "react";

import Card from "../../shared/components/UIElements/Card";
import { useForm } from "../../shared/hooks/form-hook";

import Input from "../../shared/components/FormElements/Input";
import classes from "./NewPost.module.css";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";

const NewPost = () => {
  const [formState, inputHandler, setFormData] = useForm(
    {
      post: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  return (
    <Card className={classes.card}>
      <div className={classes.input}>
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
          <button className={classes.post}>POST</button>
        </div>
      </div>
    </Card>
  );
};

export default NewPost;
