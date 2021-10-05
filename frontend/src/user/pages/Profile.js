import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { useContext } from "react";
import { useEffect } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { useState } from "react";

import classes from "./Profile.module.css";
import NewPost from "../../post/components/NewPost";
import PostsList from "../../post/components/PostsList";
import { useHttpClient } from "../../shared/hooks/use-http";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const Profile = () => {
  const profileId = useParams().id;
  const [info, setInfo] = useState(null);
  const [posts, setPosts] = useState(null);
  const { isLoading, sendRequest, error, clearError } = useHttpClient();

  const ctx = useContext(AuthContext);
  useEffect(() => {
    const getInfo = async () => {
      try {
        const response = await sendRequest(
          `http://localhost:5000/api/users/${profileId}/info`
        );
        setInfo(response);
      } catch (error) {}
    };
    clearError();
    const getPosts = async () => {
      try {
        const response = await sendRequest(
          `http://localhost:5000/api/users/${profileId}/posts`
        );
        response.reverse();
        setPosts(response);
      } catch (error) {}
    };
    getInfo();
    getPosts();
  }, [profileId]);
  if (info) {
    console.log(info.userId.toString(), profileId);
    console.log(info.userId == profileId);
  }
  return (
    <div className={classes.container}>
      {info && !isLoading && (
        <div className={classes.info}>
          <h1>{info.name}</h1>
          <img src="https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" />
          <div className={classes.friends}>
            <h2>Friends </h2>
            <Link to="/profile/friends">View all friends</Link>
          </div>
          {!isLoading &&
            info &&
            info.userId.toString() !== ctx.userId.toString() && (
              <button className={classes.btn}>Add friend</button>
            )}
        </div>
      )}
      {isLoading && <LoadingSpinner />}
      <div className={classes.border}></div>
      <div className={classes.main}>
        {posts && posts.length > 0 && !isLoading && <PostsList posts={posts} />}
        {((!posts && !isLoading) || (posts && posts.length === 0)) && (
          <p style={{ color: "white" }}>No posts yet.</p>
        )}
        {isLoading && <LoadingSpinner />}
      </div>
    </div>
  );
};

export default Profile;
