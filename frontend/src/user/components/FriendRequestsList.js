import React, { useState } from "react";

import classes from "./FriendRequestsList.module.css";
import FriendRequestItem from "../components/FriendRequestItem";
import Card from "../../shared/components/UIElements/Card";

const DUMMY_REQUESTS = [
  {
    name: "khalid",
    image:
      "https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    name: "khalid",
    image:
      "https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    name: "khalid",
    image:
      "https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    name: "khalid",
    image:
      "https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    name: "khalid",
    image:
      "https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    name: "khalid",
    image:
      "https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
];


const FriendRequestsList = (props) => {

  const items = props.requests.map((req) => {
    return (
      <FriendRequestItem
        userId={req.userId}
        name={req.name}
        userImage={req.userImage}
        refresh={props.refresh}
        key={req.userId}
      />
    );
  });

  return (
    <Card>
      {items}
    </Card>
  );
};

export default FriendRequestsList;
