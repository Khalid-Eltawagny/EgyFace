import React, { useEffect } from "react";
import { useState } from "react";

import classes from "./PostItem.module.css";
import Card from "../../shared/components/UIElements/Card";
import Avatar from "../../shared/components/UIElements/Avatar";

import { Link } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import { useForm } from "../../shared/hooks/form-hook";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";

import { useHttpClient } from "../../shared/hooks/use-http";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useContext } from "react";

const PostItem = (props) => {
  const { isLoading, error, clearError, sendRequest } = useHttpClient();
  const [isLiked, setIsLiked] = useState(false);
  const [dummyState, setDummyState] = useState(false);
  const [userId, setUserId] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const post_id = props.id;
  const ctx = useContext(AuthContext);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const res = await sendRequest(
          `http://localhost:5000/api/posts/${post_id}`
        );
        console.log(res);
        setUserId(res[0].user_id);
        setLikes(props.likes);
        setComments(props.comments);
      } catch (error) {}
    };
    getInfo();
  }, [post_id, dummyState]);

  const [formState, inputHandler, setFormData] = useForm(
    {
      comment: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const commentSubmitHandler = async () => {
    const post = {
      post_id,
      user_id: ctx.userId,
      comment: formState.inputs.comment.value,
    };
    try {
      await sendRequest(
        `http://localhost:5000/api/posts/newComment`,
        "POST",
        JSON.stringify(post),
        { "Content-Type": "application/json" }
      );
      setComments((prev) => prev + 1);
      if (props.full) {
        props.refresh();
      }
    } catch (error) {}
  };

  const flipLikeState = () => {
    setLikes(likes + 1);
    setIsLiked((prev) => !prev);
  };

  return (
    <li className={classes.item}>
      {isLoading && (
        <Card className={`${props.full ? "" : classes.card} ${classes.center}`}>
          <LoadingSpinner />
        </Card>
      )}
      {!isLoading && (
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
              <h4> {likes} |</h4> Like
            </button>

            <Link to={`/post/${props.id}`} style={{ textDecoration: "none" }}>
              <button>
                <h4> {comments} |</h4> Comments
              </button>
            </Link>
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
            <button className={classes.postBtn} onClick={commentSubmitHandler}>
              comment
            </button>
          </div>
        </Card>
      )}
    </li>
  );
};

export default PostItem;
