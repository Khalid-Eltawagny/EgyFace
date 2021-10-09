import React from "react";

import Avatar from "../../shared/components/UIElements/Avatar";
import { Link } from "react-router-dom";

import classes from "./FriendItem.module.css";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/use-http";
import { AuthContext } from "../../shared/context/auth-context";
import { useContext } from "react";

const FriendItem = (props) => {
  const { isLoading, error, clearError, sendRequest } = useHttpClient();
  const ctx = useContext(AuthContext);
  const unfriendHandler = async () => {
    if (ctx.userId) {
      const payload = { person_1_id: ctx.userId, person_2_id: props.userId };
      try {
        const res = await sendRequest(
          `http://localhost:5000/api/users/unfriend`,
          "POST",
          JSON.stringify(payload),
          { "Content-Type": "application/json" }
        );
        props.refresh();
      } catch (error) {}
    }
  };
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
      {isLoading && <LoadingSpinner />}
      {!isLoading && (
        <div className={classes.btns}>
          <button className={classes.dec} onClick={unfriendHandler}>
            Unfriend
          </button>
          <button className={classes.acc}> Send a message </button>
        </div>
      )}
    </li>
  );
};

export default FriendItem;
