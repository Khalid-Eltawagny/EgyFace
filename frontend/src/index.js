import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import "./index.css";
import App from "./App";
import { AuthContext } from "./shared/context/auth-context";

ReactDOM.render(<App />, document.getElementById("root"));
