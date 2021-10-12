import React from "react";

import CommentItem from "./CommentItem";
const DUMMY_COMMENTS = [
  {
    id: 1,
    comment: "this is the first one",
    name: "khalid",
    date: "2 hours ago",
  },
  {
    id: 2,
    comment: "this is the first one",
    name: "khalid",
    date: "2 hours ago",
  },
  {
    id: 2,
    comment: "this is the first one",
    name: "khalid",
    date: "2 hours ago",
  },
  {
    id: 2,
    comment: "this is the first one",
    name: "khalid",
    date: "2 hours ago",
  },
];

const CommentsList = (props) => {
  const comments = props.comments.map((comment) => {
    return (
      <CommentItem
        id={comment.id}
        comment={comment.comment}
        name={comment.name}
        image={comment.image}
        key={comment.id}
        refresh = {props.refresh}
        userImage = {comment.userImage}
        userId={comment.user_id}
      />
    );
  });
  return <ul>{comments}</ul>;
};

export default CommentsList;
