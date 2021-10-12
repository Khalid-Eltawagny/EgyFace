import React, { useState } from "react";
import NewPost from "../../post/components/NewPost";
import PostsList from "../../post/components/PostsList";
import { AuthContext } from "../../shared/context/auth-context";
import { useContext } from "react";
import { useEffect } from "react";
import { useHttpClient } from "../../shared/hooks/use-http";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import classes from "./Home.module.css";

const Home = () => {
  const [posts, setPosts] = useState(null);
  const [friendsIds, setFriendsIds] = useState(false);
  const ctx = useContext(AuthContext);
  const { isLoading , sendRequest } = useHttpClient();

  const getPosts = async (id) => {
    console.log("here");
    try {
      const friendsIds = await sendRequest(
        `http://localhost:5000/api/users/${id}/friends`
      );
      console.log(friendsIds);
      if (friendsIds.length !== 0) {
        setFriendsIds(true);
      }
      let posts;
      if (friendsIds.length > 0) {
        const promises = friendsIds.map((id_) => {
          return new Promise(async (resolve, reject) => {
            try {
              const posts = await sendRequest(
                `http://localhost:5000/api/users/${id_}/posts`
              );
              console.log(posts);
              return resolve(posts);
            } catch (error) {
              return reject(error);
            }
          });
        });
        posts = await Promise.all(promises);
        console.log('friends posts ',posts) ; 
      }

      console.log(posts);
      if (posts && posts[0].length > 0) {
        console.log("hereeeeeeeeeeeeeee");
        const imagePromises = posts[0].map((post) => {
          console.log(post);
          return new Promise(async (resolve, reject) => {
            try {
              console.log(post);
              const info = await sendRequest(
                `http://localhost:5000/api/users/${post.user_id}/info`
              );
              post["userImage"] = info.userImage;
              resolve();
            } catch (error) {
              return reject(error);
            }
          });
        });
        await Promise.all(imagePromises);
      }

      console.log(posts);
      try {
        const info = await sendRequest(
          `http://localhost:5000/api/users/${id}/info`
        );
        const myposts = await sendRequest(
          `http://localhost:5000/api/users/${id}/posts`
        );
        console.log(myposts);
        console.log(info);
        myposts.forEach((element) => {
          element["userImage"] = info.userImage;
        });
        if (posts.length === 0) {
          myposts.sort((x, y) => {
            return +new Date(y.post_date) - +new Date(x.post_date);
          });
          setPosts(myposts);
        } else {
          myposts.forEach((post) => {
            posts[0].push(post);
          });
        }
      } catch (error) {}
      if (posts.length !== 0) {
        console.log(posts);
        posts[0].sort((x, y) => {
          return +new Date(y.post_date) - +new Date(x.post_date);
        });
        console.log(posts);
        setPosts(posts);
      }
      console.log(posts);
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
    <div className={classes.container}>

      
      <NewPost refresh={refresh} />



      <div className={classes.postsContainer}>
        {!isLoading && posts && (
          <PostsList posts={friendsIds ? posts[0] : posts} refresh={refresh} />
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
  );
};

export default Home;
