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
  const [friendsIds, setFriendsIds] = useState(false);
  const ctx = useContext(AuthContext);
  const { isLoading, error, clearError, sendRequest } = useHttpClient();

  const getPosts = async (id) => {
    console.log('here') ; 
    try {
      const friendsIds = await sendRequest(
        `http://localhost:5000/api/users/${id}/friends`
      );
      if (friendsIds.length !== 0) {
        setFriendsIds(true);
      }
      const promises = friendsIds.map((id_) => {
        return new Promise(async (resolve, reject) => {
          try {
            const posts = await sendRequest(
              `http://localhost:5000/api/users/${id_}/posts`
            );
            return resolve(posts);
          } catch (error) {
            return reject(error);
          }
        });
      });
      const posts = await Promise.all(promises);
      try {
        const myposts = await sendRequest(
          `http://localhost:5000/api/users/${id}/posts`
        );
        if (posts.length === 0) {
          setPosts(myposts);
        } else {
          myposts.forEach((post) => {
            posts[0].push(post);
          });
        }
      } catch (error) {}
      if (posts.length !== 0) {
        setPosts(posts);
      }
    } catch (error) {}
  };

  const refresh = async (id) => {
    getPosts(ctx.userId);
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
          {!isLoading && posts && (
            <PostsList
              posts={friendsIds ? posts[0] : posts}
              refresh={refresh}
            />
          )}
          {isLoading && <LoadingSpinner />}
          {!isLoading &&
            posts &&
            friendsIds &&
            posts[0] &&
            posts[0].length === 0 && <h1>No posts yet.</h1>}
          {!isLoading && !posts && <h1>No posts yet.</h1>}
          {!isLoading && posts && posts.length === 0 && <h1>No posts yet.</h1>}
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
