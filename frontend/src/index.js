import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import "./index.css";
import App from "./App";
import { AuthContext } from "./shared/context/auth-context";

ReactDOM.render(
  <AuthContext.Provider
    value={{
      isLoggedIn: false,
      userId: undefined,
      token: undefined,
      login: () => {},
      logout: () => {},
    }}
  >
    <Router>
      <App />
    </Router>
  </AuthContext.Provider>,
  document.getElementById("root")
);
