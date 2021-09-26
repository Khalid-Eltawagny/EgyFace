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

const CommentsList = () => {
  const comments = DUMMY_COMMENTS.map((comment) => {
    return (
      <CommentItem
        id={comment.id}
        comment={comment.comment}
        name={comment.name}
        date={comment.date}
        image={comment.image}
        key={comment.id}
      />
    );
  });
  return <ul>{comments}</ul>;
};

export default CommentsList;
