import React from "react";
import { Fragment } from "react";
import classes from "./Friends.module.css";
import { useEffect, useState } from "react";

import FriendRequestsList from "../components/FriendRequestsList";
import FriendsMenu from "../components/FriendsMenu";
import { useHttpClient } from "../../shared/hooks/use-http";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useContext } from "react";

const Friends = () => {
  const ctx = useContext(AuthContext);
  const [friends, setFriends] = useState(null);
  const [requests, setRequests] = useState(null);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const getFriends = async () => {
      try {
        const response = await sendRequest(
          `http://localHost:5000/api/users/${ctx.userId}/friends`
        );
        setFriends(response);
      } catch (error) {}
    };
  }, [friends, requests, ctx]);
  return (
    <Fragment>
      <FriendRequestsList />
      <FriendsMenu />
    </Fragment>
  );
};

export default Friends;
