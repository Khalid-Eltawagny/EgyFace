import React, { useEffect } from "react";
import { useState } from "react";

import classes from "./PostItem.module.css";
import Card from "../../shared/components/UIElements/Card";

import { Link } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import { useForm } from "../../shared/hooks/form-hook";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";

import { useHttpClient } from "../../shared/hooks/use-http";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useContext } from "react";

const PostItem = (props) => {
  const { isLoading, sendRequest } = useHttpClient();
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

  useEffect(() => {
    const getIsLiked = async () => {
      try {
        const res = await sendRequest(
          `http://localhost:5000/api/users/isLiked/${ctx.userId}/${post_id}`
        );
        setIsLiked(res.isLiked);
        console.log(res.isLiked);
      } catch (error) {}
    };
    getIsLiked();
  }, [ctx]);

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

  const likeSubmitHandler = () => {
    const payload = { user_id: ctx.userId, post_id };
    if (!isLiked) {
      const sendLike = async () => {
        try {
          await sendRequest(
            `http://localhost:5000/api/posts/like`,
            "POST",
            JSON.stringify(payload),
            { "Content-Type": "application/json" }
          );
        } catch (error) {}
      };
      sendLike();
      setLikes(likes + 1);
      setIsLiked((prev) => !prev);
    } else {
      const sendDislike = async () => {
        try {
          await sendRequest(
            `http://localhost:5000/api/posts/dislike`,
            "POST",
            JSON.stringify(payload),
            { "Content-Type": "application/json" }
          );
        } catch (error) {}
      };
      sendDislike();
      setLikes(likes - 1);
      setIsLiked((prev) => !prev);
    }
  };

  return (
    <Card className={classes.item}>
      {!isLoading && (
        <React.Fragment>
          <div className={classes.header}>
            <Link to={`/profile/${userId}`}>
              <div className={classes.avt}>
                <img
                  src={`http://localhost:5000/${props.userImage}`}
                  alt={"this is a photo"}
                />
              </div>
              <div className={classes.name}>
                <h3>{props.name}</h3>
              </div>
            </Link>
          </div>
          <h5>{props.date}</h5>
          <div className={classes.line}></div>

          <div className={classes.post}>
            <p>{props.post}</p>
            {props.postImage && (
              <div className={classes.postImage}>
                {props.postImage && (
                  <img src={`http://localhost:5000/${props.postImage}`} />
                )}
              </div>
            )}
          </div>

          <div className={classes.line}></div>
          <div className={classes.options}>
            {!props.full && (
              // <div className={classes.fullpostOpt}>
              <Link to={`/post/${props.id}`}> View full post</Link>
              // </div>
            )}
            {userId == ctx.userId && (
              <button className={classes.delete}> Delete Post</button>
            )}
          </div>
          <div className={classes.actions}>
            {isLoading && <LoadingSpinner />}
            {!isLoading && (
              <button
                className={isLiked ? classes.liked : ""}
                onClick={likeSubmitHandler}
              >
                <h4> {likes} |</h4> Like
              </button>
            )}

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
            <button
              className={classes.postBtn}
              onClick={commentSubmitHandler}
              disabled={!formState.isValid}
            >
              comment
            </button>
          </div>
        </React.Fragment>
      )}
    </Card>
  );
};

export default PostItem;
