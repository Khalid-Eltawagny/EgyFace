import React from "react";

import classes from "./PostsList.module.css";
import PostItem from "./PostItem";

const PostsList = (props) => {
  console.log(props.posts) ; 
  const posts = props.posts.map((post) => {
    return (
      <PostItem
        key={post.id}
        id={post.postId}
        name={post.name}
        likes={post.likes}
        post={post.post}
        comments={post.comments}
        postImage={post.postImage}
        date={post.date}
        full={false}
      />
    );
  });
  return <ul> {posts} </ul>;
};

export default PostsList;
