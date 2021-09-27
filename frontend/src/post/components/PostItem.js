import React from "react";
import { useState } from "react";

import classes from "./PostItem.module.css";
import Card from "../../shared/components/UIElements/Card";
import Avatar from "../../shared/components/UIElements/Avatar";

import { Link } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import { useForm } from "../../shared/hooks/form-hook";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";

const PostItem = (props) => {
  const [isLiked, setIsLiked] = useState(false);

  const [formState, inputHandler, setFormData] = useForm(
    {
      comment: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const flipLikeState = () => {
    setIsLiked((prev) => !prev);
  };

  console.log(props);

  return (
    <li className={classes.item}>
      <Card className={props.full ? "" : classes.card}>
        {!props.full && (
          <Link className={classes.link} to={`/post/${props.id}`}>
            <div className={classes.header}>
              <div className={classes.avt}>
                <Avatar
                  image="https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                  alt={props.alt}
                />
              </div>
              <div className={classes.name}>
                <h3>{props.name}</h3>
              </div>
            </div>
            <h5>{props.date}</h5>
            <div className={classes.line}></div>

            <div className={classes.post}>
              <p>{props.post}</p>
              <div className={classes.postImage}>
                {props.postImage && <img src={props.postImage} />}
              </div>
            </div>
          </Link>
        )}
        {props.full && (
          <div>
            <div className={classes.header}>
              <div className={classes.avt}>
                <Avatar
                  image="https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                  alt={props.alt}
                />
              </div>
              <div className={classes.name}>
                <h3>{props.name}</h3>
              </div>
            </div>
            <h5>{props.date}</h5>
            <div className={classes.line}></div>

            <div className={classes.post}>
              <p>{props.post}</p>
              <div className={classes.postImage}>
                {props.postImage && <img src={props.postImage} />}
              </div>
            </div>
          </div>
        )}
        <div className={classes.line}></div>
        <div className={classes.actions}>
          <button
            className={isLiked ? classes.liked : ""}
            onClick={flipLikeState}
          >
            <h4> {props.likes} |</h4> Like
          </button>

          <button>
            <h4> {props.comments} |</h4> Comments
          </button>
        </div>
        <div className={classes.commentActions}>
          <div className={classes.commentArea}>
            <Input
              element="textArea"
              id="comment"
              type="text"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid comment"
              placeholder="Type your comment"
              onInput={inputHandler}
              className={classes.comment}
            />
          </div>
          <button className={classes.commentButton}>comment</button>
        </div>
      </Card>
    </li>
  );
};

export default PostItem;
