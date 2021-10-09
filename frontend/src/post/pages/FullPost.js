import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Fragment } from "react";

import PostsList from "../components/PostsList";
import PostItem from "../components/PostItem";
import CommentsList from "../components/CommentsList";

import classes from "./FullPost.module.css";
import Card from "../../shared/components/UIElements/Card";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/use-http";

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

const FullPost = () => {
  const { isLoading, error, clearError, sendRequest } = useHttpClient();
  const [comments, setComments] = useState(null);
  const postId = useParams().id;
  const [post, setPost] = useState(null);
  const [refState, setRefState] = useState(false);

  const refresh = () => {
    setRefState((prev) => !prev);
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await sendRequest(
          `http://localhost:5000/api/posts/${postId}/comments`
        );
        console.log(res);
        setComments(res);
      } catch (error) {}
    };
    getComments();
  }, [postId, refState]);

  useEffect(() => {
    if (postId) {
      console.log(postId);
      const getPost = async () => {
        try {
          const res = await sendRequest(
            `http://localhost:5000/api/posts/${postId}`
          );
          console.log(res);
          const payload = { postId, userId: res[0].user_id };
          console.log(payload);
          const fullPost = await sendRequest(
            `http://localhost:5000/api/users/getSinglePost`,
            "POST",
            JSON.stringify(payload),
            { "Content-Type": "application/json" }
          );
          console.log(fullPost);
          setPost(fullPost);
          console.log(res);
        } catch (error) {
          console.log(error);
        }
      };
      getPost();
      console.log(post);
    }
  }, [postId]);

  return (
    <Fragment>
      <ul className={classes.cover}>
        {isLoading && <LoadingSpinner />}
        {!isLoading && post && (
          <PostItem
            id={post.id}
            post={post.post}
            likes={post.likes}
            comments={post.comments}
            name={post.name}
            date={post.date}
            postImage={post.postImage}
            full={true}
            refresh={refresh}
          />
        )}
        <h1 style={{ color: "white" }}>Comments</h1>
      </ul>
      {isLoading && <LoadingSpinner />}
      {!isLoading && comments && comments.length > 0 && (
        <CommentsList comments={comments} refresh={refresh} />
      )}
      {!isLoading && comments && comments.length === 0 && (
        <h1 style={{ textAlign: "center" }}>No comments yet.</h1>
      )}
    </Fragment>
  );
};

export default FullPost;
