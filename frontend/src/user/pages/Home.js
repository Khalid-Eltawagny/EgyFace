import React, { useState } from "react";
import NewPost from "../../post/components/NewPost";
import PostsList from "../../post/components/PostsList";
import { AuthContext } from "../../shared/context/auth-context";
import { useContext } from "react";
import { useEffect } from "react";
import { useHttpClient } from "../../shared/hooks/use-http";
import { Fragment } from "react";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import classes from "./Home.module.css";
const Home = () => {
  const [posts, setPosts] = useState(null);
  const ctx = useContext(AuthContext);
  const { isLoading, error, clearError, sendRequest } = useHttpClient();

  const getPosts = async (id) => {
    try {
      const response = await sendRequest(
        `http://localhost:5000/api/users/${id}/posts`
      );
      response.reverse();
      setPosts(response);
    } catch (error) {}
  };

  const refresh = async (id) => {
    getPosts(id);
  };

  useEffect(() => {
    const id = ctx.userId;
    if (id) {
      getPosts(id);
    }
  }, [ctx]);

  return (
    <Fragment>
      <div className={classes.container}>
        <NewPost refresh={refresh} />
        <div className={classes.postsContainer}>
        {!isLoading && posts && posts.length > 0 && <PostsList posts={posts} />}
        {isLoading && <LoadingSpinner />}
        {!isLoading && posts && posts.length === 0 && <h1>No posts yet.</h1>}

        </div>
      </div>
    </Fragment>
  );
};

export default Home;
