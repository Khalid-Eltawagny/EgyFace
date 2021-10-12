import React from "react";
import UserSearchItem from "./UserSearchItem";

const UserSearchList = (props) => {
  console.log(props);
  if (props.word.length === 0) {
    return <h2>No users found.</h2>;
  }
  
  const filteredList = props.users.filter((user) => {
    return user.name.toLowerCase().substr(0, props.word.length) === props.word.toLowerCase();
  });

  const usersList = filteredList.map((user) => {
    return (
      <UserSearchItem
        searchedWord={props.word}
        userId={user.id}
        name={user.name}
        userImage={user.image}
      />
    );
  });
  if (usersList.length === 0) {
    return <h2>No users found.</h2>;
  }
  return <ul>{usersList}</ul>;
};

export default UserSearchList;
