import React from "react";
import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: undefined,
  token: undefined,
  login: (uid,token,expirationDate) => {},
  logout: () => {},
});
