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

const FriendsMenu = () => {
  const friends = DUMMY_FRIENDS.map((friend) => (
    <FriendItem id={friend.id} name={friend.name} image={friend.image} />
  ));
  return <Card>
        <h2>Friends :</h2>
      {friends}</Card>;
};

export default FriendsMenu;
