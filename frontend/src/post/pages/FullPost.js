import React from "react";
import { useParams } from "react-router";
import { Fragment } from "react";

import PostsList from "../components/PostsList";
import PostItem from "../components/PostItem";
import CommentsList from "../components/CommentsList";

import classes from "./FullPost.module.css";
import Card from "../../shared/components/UIElements/Card";

const DUMMY_POSTS = [
  {
    id: 1,
    post: "Ahly Ahly Ahly!!!",
    likes: 5,
    comments: 12,
    postImage:
      "https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    name: "khalid",
    date: "1 hour ago",
  },
  {
    id: 2,
    post: "I Love cats",
    likes: 100,
    comments: 12,
    name: "Ahmed bahgat",
    date: "3 hours ago",
  },
  {
    id: 3,
    post: "I'm very sad",
    likes: 0,
    comments: 120,
    name: "khalid",
    date: "Just now",
  },
];

const FullPost = (props) => {
  const postId = useParams().id;
  const post = DUMMY_POSTS.filter((post) => post.id.toString() === postId)[0];
  return (
    <Fragment>
      <ul className={classes.cover}>
        <PostItem
          id={post.id}
          post={post.post}
          likes={post.likes}
          comments={post.comments}
          name={post.name}
          date={post.date}
          full={true}
        />
        <h1>Comments</h1>
      </ul>
      <CommentsList />
    </Fragment>
  );
};

export default FullPost;
