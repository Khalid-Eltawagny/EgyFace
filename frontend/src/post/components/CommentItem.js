import React from "react";

import Card from "../../shared/components/UIElements/Card";
import Avatar from "../../shared/components/UIElements/Avatar";
import { Link } from "react-router-dom";
import classes from "./Comment.module.css";

const CommentItem = (props) => {
  console.log(props) ; 
  return (
    <li className={classes.item}>
      <Card className={classes.comment}>
        <div className={classes.header}>
          <Link to={`/profile/${props.userId}`}>
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
        <p>{props.comment}</p>
      </Card>
    </li>
  );
};

export default CommentItem;
