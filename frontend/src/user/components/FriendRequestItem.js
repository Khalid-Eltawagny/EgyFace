import React from "react";

import Avatar from "../../shared/components/UIElements/Avatar";

import classes from "./FriendRequestItem.module.css";

const FriendRequestItem = (props) => {
  return (
    <li className={classes.container}>
      <div className={classes.photo}>
        <Avatar image={props.image} />
      </div>
      <h2>{props.name}</h2>
      <div className={classes.btns}>
        <button className={classes.acc}> Accept </button>
        <button className={classes.dec}> Decline </button>
      </div>

    </li>
  );
};

export default FriendRequestItem;
