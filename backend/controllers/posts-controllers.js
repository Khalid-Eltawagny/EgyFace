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

const getPost = async (req, res, next) => {
  const postId = req.params.id;

  const query = `SELECT * FROM posts WHERE id = ${postId}`;
  con.query(query, (err, result) => {
    if (err) {
      return next(new HttpError("Something went wrong,please try again.", 500));
    }
    res.status(200).json(result);
  });
};

const newComment = async (req, res, next) => {
  const post = req.body;

  const query = `INSERT INTO comments SET ?`;

  con.query(query, post, (err, result) => {
    if (err) {
      console.log(err);
      return next(new HttpError("Something went wrong,please try again.", 500));
    }
    res.status(201).json(result);
  });
};

const getComments = async (req, res, next) => {
  const postId = req.params.id;
  const query = `SELECT * FROM comments WHERE post_id = ${postId}`;
  con.query(query, async (err, result) => {
    if (err) {
      return next(new HttpError("Something went wrong,please try again.", 500));
    }
    const comments = result;
    const promises = comments.map((comment, indx) => {
      return new Promise((resolve, reject) => {
        const userId = comment.user_id;
        const query = `SELECT * FROM users WHERE id = ${userId}`;
        con.query(query, (err, result) => {
          if (err) {
            return reject(
              next(new HttpError("Something went wrong,please try again.", 500))
            );
          }
          console.log(userId);
          comments[indx].name = result[0].name;
          resolve();
        });
      });
    });

    await Promise.all(promises);
    console.log(comments);
    res.status(200).json(comments);
  });
};

const like = async (req, res, next) => {
  const likeInfo = req.body;
  const query = `INSERT INTO likes SET ?`;
  con.query(query, likeInfo, (err, result) => {
    if (err) {
      return reject(
        next(new HttpError("Something went wrong,please try again.", 500))
      );
    }
    res.status(201).json() ;
  });
};

const dislike = async(req,res,next) => {
  const likeInfo = req.body;
  const query = `DELETE FROM likes WHERE user_id = ${likeInfo.user_id} AND post_id = ${likeInfo.post_id}`;
  con.query(query, likeInfo, (err, result) => {
    if (err) {
      return reject(
        next(new HttpError("Something went wrong,please try again.", 500))
      );
    }
    res.status(201).json() ;
  });
};

exports.addPost = addPost;
exports.getPost = getPost;
exports.newComment = newComment;
exports.getComments = getComments;
exports.like = like;
exports.dislike = dislike;
