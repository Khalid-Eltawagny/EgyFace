import React from "react";
import { Fragment } from "react";

import Auth from "../src/user/pages/Auth";
import PostsList from "./post/components/PostsList";
import CommentsList from "./post/components/CommentsList";
import FullPost from "../src/post/pages/FullPost";
import Navigation from "./shared/components/Navigation/Navigation";
import Layout from "./shared/components/UIElements/Layout";
import Profile from "./user/pages/Profile";

import Friends from "./user/pages/Friends";

import NewPost from "./post/components/NewPost";

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

const App = () => {
  return (
    <Fragment>
      <Switch>
        <Route path="/" exact>
          <Auth />
        </Route>
        <Route path="/home" exact>
          <Layout>
            <ul>
              <NewPost />
            </ul>
            <PostsList />
          </Layout>
        </Route>
        <Route path="/profile/friends">
          <Layout>
            <Friends />
          </Layout>
        </Route>
        <Route path="/profile/:id" exact>
          <Layout>
            <Profile />
          </Layout>
        </Route>
        <Route path={`/post/:id`} exact>
          <Layout>
            <FullPost />
          </Layout>
        </Route>
        <Route path="*">
          <Redirect to="/home" />
        </Route>
      </Switch>
    </Fragment>
  );
};

export default App;
