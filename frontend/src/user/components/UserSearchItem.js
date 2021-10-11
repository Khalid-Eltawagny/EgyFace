import React from "react";
import { Link } from "react-router-dom";

import classes from "./UserSearchItem.module.css";

import Avatar from "../../shared/components/UIElements/Avatar";

const UserSearchItem = (props) => {
  return (
    <li className={classes.container}>
      <div className={classes.info}>
        <Link to={`/profile/${props.userId}`}>
          <div className={classes.photo}>
            <Avatar image={props.image} />
          </div>
          <h2>{props.name}</h2>
        </Link>
      </div>
    </li>
  );
};

export default UserSearchItem;
