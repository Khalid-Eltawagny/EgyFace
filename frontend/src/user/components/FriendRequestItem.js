import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";

import Avatar from "../../shared/components/UIElements/Avatar";
import classes from "./FriendRequestItem.module.css";

import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/use-http";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const FriendRequestItem = (props) => {
  const ctx = useContext(AuthContext);
  const { isLoading, error, clearError, sendRequest } = useHttpClient();
  const acceptHandler = async () => {
    if (ctx.userId) {
      const userId = props.userId;
      const payload = { person_1_id: userId, person_2_id: ctx.userId };
      console.log(payload);
      try {
        const response = await sendRequest(
          "http://localhost:5000/api/users/acceptrequest",
          "POST",
          JSON.stringify(payload),
          { "Content-Type": "application/json" }
        );
        props.refresh();
      } catch (error) {}
    }
  };
  const declineHandler = async () => {
    if (ctx.userId) {
      const userId = props.userId;
      const payload = { person_1_id: userId, person_2_id: ctx.userId };
      try {
        const response = await sendRequest(
          "http://localhost:5000/api/users/declinerequest",
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
      {isLoading && <LoadingSpinner />}
      <div className={classes.info}>
        <Link to={`/profile/${props.userId}`}>
          <div className={classes.photo}>
            <Avatar image={props.image} />
          </div>
          <h2>{props.name}</h2>
        </Link>
      </div>
      {!isLoading && (
        <div className={classes.btns}>
          <button className={classes.acc} onClick={acceptHandler}>
            Accept
          </button>
          <button className={classes.dec} onClick={declineHandler}>
            Decline
          </button>
        </div>
      )}
    </li>
  );
};

export default FriendRequestItem;
