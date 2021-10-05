const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Kh@lid0100123123",
  database: "teez_book",
});

con.connect((err) => {
  if (err) throw new HttpError("Couldn't connect to this database server", 500);
});

const addPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid post,please try again.", 500));
  }
  const { user_id, post } = req.body;
  const query = `SELECT * FROM users WHERE id = ${user_id}`;
  con.query(query, (err, result) => {
    if (err) {
      return next(new HttpError("Something went wrong,please try again.", 500));
    }
    if (result.result === 0) {
      return next(
        new HttpError("Couldn't create this post,please try again.", 500)
      );
    }
    const Post = {
      user_id,
      post: post,
    };

    const query = "INSERT INTO posts SET ?";
    con.query(query, Post, (err, result) => {
      if (err) {
        return next(
          new HttpError("Something went wrong,please try again.", 500)
        );
      }
      res.status(201).json(result);
    });
  });
};

exports.addPost = addPost;
