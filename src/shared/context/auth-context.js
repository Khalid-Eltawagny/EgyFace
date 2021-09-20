import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: undefined,
  token: null,
  login: () => {},
  logout: () => {},
});
