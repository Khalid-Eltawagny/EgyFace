import React from "react";

import classes from "./PostsList.module.css";
import PostItem from "./PostItem";

const DUMMY_POSTS = [
  {
    id: 1,
    post: "Ahly Ahly Ahly!!!",
    likes: 5,
    comments: 12,
    postImage:
      "https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    name: "khalid",
    date:"1 hour ago"
  },
  {
    id: 2,
    post: "I Love cats",
    likes: 100,
    comments: 12,
    name: "Ahmed bahgat",
    date:"3 hours ago"
  },
  {
    id: 3,
    post: "I'm very sad",
    likes: 0,
    comments: 120,
    name: "khalid",
    date:"Just now"
  },
];

const PostsList = (props) => {
  const posts = DUMMY_POSTS.map((post) => {
    return (
      <PostItem
        key={post.id}
        id={post.id}
        name={post.name}
        likes={post.likes}
        post={post.post}
        comments={post.comments}
        postImage={post.postImage}
        date={post.date}
      />
    );
  });
  return <ul> {posts} </ul>;
};

export default PostsList;
