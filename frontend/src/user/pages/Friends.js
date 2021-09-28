import React from "react";
import { Fragment } from "react";
import classes from "./Friends.module.css";

import FriendRequestsList from "../components/FriendRequestsList";
import FriendsMenu from "../components/FriendsMenu" ; 
const Friends = () => {
  return (
    <Fragment>
      <FriendRequestsList />  
      <FriendsMenu />
    </Fragment>
  );
};

export default Friends;
