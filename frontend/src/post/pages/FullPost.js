import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Fragment } from "react";

import PostItem from "../components/PostItem";
import CommentsList from "../components/CommentsList";

import classes from "./FullPost.module.css";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/use-http";

const FullPost = () => {
  const { isLoading, sendRequest } = useHttpClient();
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
        const imagePromises = res.map((comment) => {
          return new Promise(async (resolve, reject) => {
            try {
              const info = await sendRequest(
                `http://localhost:5000/api/users/${comment.user_id}/info`
              );
              comment.userImage = info.userImage;
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        });
        await Promise.all(imagePromises);
        res.reverse();
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
            userImage={post.userImage}
            full={true}
            refresh={refresh}
          />
        )}
      </ul>
      <h1 style={{ color: "white", textAlign: "center" }}>Comments</h1>
      {isLoading && <LoadingSpinner />}
      {!isLoading && comments && comments.length > 0 && (
        <CommentsList comments={comments} refresh={refresh} />
      )}
      {!isLoading && comments && comments.length === 0 && (
        <h1 style={{ textAlign: "center" , color:"white" }}>No comments yet.</h1>
      )}
    </Fragment>
  );
};
export default FullPost;
