import React from "react";
import { NavLink } from "react-router-dom";

import classes from "./NavLinks.module.css";

const NavLinks = (props) => {
  return (
    <ul className={classes.links}>
      <li>
        <span style={{ marginRight: "5px", color: "red", fontWeight: "900" }}>
          12
        </span>
        <button className={classes.button__}>Notifications</button>
      </li>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/profile">Profile</NavLink>
      </li>
      <li>
        <span style={{ marginRight: "5px", color: "red", fontWeight: "900" }}>
          12
        </span>
        <NavLink to="/messanger">Messages</NavLink>
      </li>
      <li>
        <NavLink to="/settings">Settings</NavLink>
      </li>
      <li>
        <button className={classes.button__}>Log out</button>
      </li>
    </ul>
  );
};

export default NavLinks;
