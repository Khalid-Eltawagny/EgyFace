import React from "react";
import { Link } from "react-router-dom";

import classes from "./Profile.module.css";
import NewPost from "../../post/components/NewPost";
import PostsList from "../../post/components/PostsList";

const Profile = () => {
  return (
    <div className={classes.container}>
      <div className={classes.info}>
        <h1>Khalid Eltawagny</h1>
        <img src="https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" />
        <div className={classes.friends}>
          <h2>Friends </h2>
          <Link to="/profile/friends">View all friends</Link>
        </div>
      </div>
      <div className={classes.border}></div>
      <div className={classes.main}>
        <PostsList />
      </div>
    </div>
  );
};

export default Profile;
