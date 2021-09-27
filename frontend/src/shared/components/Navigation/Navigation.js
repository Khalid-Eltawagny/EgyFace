import React from "react";
import { NavLink } from "react-router-dom";

import { useContext } from "react";

import { AuthContext } from "../../context/auth-context";

import NavLinks from "./NavLinks";

import classes from "./Navigation.module.css";

const Navigation = () => {
  const ctx = useContext(AuthContext);
  return (
    <div className={classes.container}>
      <div className={classes.logo}>
        <NavLink to="/home">
          <h1>teezbook</h1>
        </NavLink>
      </div>
      {!ctx.isLoggedIn && (
        <div className={classes.linksContainer}>
          <NavLinks />
        </div>
      )}
    </div>
  );
};

export default Navigation;
