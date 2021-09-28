import React from "react";
import { NavLink } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../../context/auth-context";
import classes from "./NavLinks.module.css";

const NavLinks = (props) => {

  const ctx = useContext(AuthContext) ; 

  return (
    <ul className={classes.links}>
      <li>
        <NavLink to="/home" activeClassName={classes.selected} exact>Home</NavLink>
      </li>
      <li>
        <NavLink to="/profile/1"  activeClassName={classes.selected} exact>Profile</NavLink>
      </li>
      <li>
        <span style={{ marginRight: "5px", color: "red", fontWeight: "900" }}>
          12
        </span>
        <NavLink activeClassName={classes.selected} to="/messanger" exact>Messages</NavLink>
      </li>
      <li>
        <NavLink activeClassName={classes.selected} to="/profile/friends" exact>Friends</NavLink>
      </li>
      <li>
        <button className={classes.button__}>Log out</button>
      </li>
    </ul>
  );
};

export default NavLinks;
