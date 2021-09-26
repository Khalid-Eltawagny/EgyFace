import React from "react";
import { useState } from "react";

import classes from "./PostItem.module.css";
import Card from "../../shared/components/UIElements/Card";
import Avatar from "../../shared/components/UIElements/Avatar";
const PostItem = (props) => {
  const [isLiked, setIsLiked] = useState(false);

  const flipLikeState = () => {
    setIsLiked((prev) => !prev);
  };
  return (
    <li className={classes.item}>
      <Card>
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
      </Card>
    </li>
  );
};

export default PostItem;
