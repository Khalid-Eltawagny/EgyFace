import React from "react";
import { NavLink } from "react-router-dom";

import NavLinks from "./NavLinks";

import classes from "./Navigation.module.css";

const Navigation = () => {
  return (
    <div className={classes.container}>
      <div className={classes.logo}>
        <NavLink to="/">
          <h1>teezbook</h1>
        </NavLink>
      </div>
      <div className={classes.linksContainer}>
          <NavLinks />
      </div>
    </div>
  );
};

export default Navigation;
