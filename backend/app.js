const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const HttpError = require("./models/http-error");
const userRoutes = require("./routes/user-routes");

const app = express();

app.use(bodyParser.json());

// app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "POST ,GET ,PATCH ,DELETE");
  next();
});

app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  throw new HttpError("Could not find this route.", 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

app.listen(5000);
