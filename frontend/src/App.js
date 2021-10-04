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
import { AuthContext } from "./shared/context/auth-context";
import useAuth from "./shared/hooks/use-auth";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

const App = () => {
  const { token, login, logout, userId } = useAuth();
  let routes;

  if (!token) {
    routes = (
      <Switch>
        <Route path={"/"} exact>
          <Auth />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/home" exact>
          <Layout>
            <ul>
              <NewPost />
            </ul>
            <PostsList />
          </Layout>
        </Route>
        <Route path={"/profile/friends"} exact>
          <Layout>
            <Friends />
          </Layout>
        </Route>
        <Route path={"/profile/:id"}>
          <Layout>
            <Profile />
          </Layout>
        </Route>
        <Route path={`/post/:id`} exact>
          <Layout>
            <FullPost />
          </Layout>
        </Route>
        <Redirect to="/home"></Redirect>
      </Switch>
    );
  }
  console.log(routes);
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: false,
        userId: userId,
        token: token,
        login: login,
        logout: logout,
      }}
    >
      <Router>{routes}</Router>
    </AuthContext.Provider>
  );
};

export default App;
