import React from "react";

import Avatar from "../../shared/components/UIElements/Avatar";
import { Link } from "react-router-dom";

import classes from "./FriendItem.module.css";

const FriendItem = (props) => {
  return (
    <li className={classes.container}>
      <div className={classes.info}>
        <Link to={`/profile/${props.id}`}>
          <div className={classes.photo}>
            <Avatar image={props.image} />
          </div>
          <h2>{props.name}</h2>
        </Link>
      </div>
      <div className={classes.btns}>
        <button className={classes.dec}> Unfriend </button>
        <button className={classes.acc}> Send a message </button>
      </div>
    </li>
  );
};

export default FriendItem;
