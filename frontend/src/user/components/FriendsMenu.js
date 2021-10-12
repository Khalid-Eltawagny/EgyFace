import React from "react";

import classes from "./FriendsMenu.module.css";
import Card from "../../shared/components/UIElements/Card";

import FriendItem from "./FriendItem";

const DUMMY_FRIENDS = [
  {
    id: 1,
    name: "khalid",
    image:
      "https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    id: 2,
    name: "khalid",
    image:
      "https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
];

const FriendsMenu = (props) => {
  const friends = props.friends.map((friend, indx) => (
    <FriendItem
      userId={friend.userId}
      key={friend.userId}
      name={friend.name}
      userImage={friend.userImage}
      refresh={props.refresh}
    />
  ));
  return <Card>{friends}</Card>;
};

export default FriendsMenu;
