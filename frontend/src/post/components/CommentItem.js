import React from "react";

import Card from "../../shared/components/UIElements/Card";
import Avatar from "../../shared/components/UIElements/Avatar";

import classes from "./Comment.module.css";

const CommentItem = (props) => {
  return (
    <li className={classes.item}>
      <Card className={classes.comment}>
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
        <p>{props.comment}</p>
      </Card>
    </li>
  );
};

export default CommentItem;
