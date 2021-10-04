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

const getInfo = async (req, res, next) => {
  const userId = req.params.id;
  const query = `SELECT * FROM users WHERE id = ${userId} `;
  con.query(query, (err, result) => {
    if (err) {
      return next(
        new HttpError("Something went wrong, please try agian later.", 422)
      );
    }
    if (result.length === 0) {
      return next(new HttpError("User not found.", 422));
    }
    const user = {
      name: result[0].name,
      email: result[0].email,
      userId: result[0].id,
      userImage: result[0].image,
    };
    res.status(200).json(user);
  });
};
const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, password, email } = req.body;

  // first make sure that the email is used for the first time .
  const query = `SELECT * FROM users WHERE email = "${email}"`;
  con.query(query, async (err, result) => {
    if (err) {
      return next(
        new HttpError("Something went wrong please try again later.", 422)
      );
    }
    if (result.length !== 0) {
      return next(
        new HttpError(
          "This email is elready exists, please try another one",
          422
        )
      );
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (error) {
      return next(new HttpError("Couldn't create a user.", 500));
    }

    const user = {
      name,
      password: hashedPassword,
      email,
    };

    const query = "INSERT INTO users SET ?";

    con.query(query, user, (err, result) => {
      if (err) {
        return next(new HttpError("Couldn't create a user.", 500));
      }
      let token;
      try {
        token = jwt.sign(
          {
            userId: result.insertId,
            email,
            name,
          },
          "it is kinda funny",
          { expiresIn: "1h" }
        );
      } catch (error) {
        return next(new HttpError("Couldn't create a user.", 500));
      }
      res.status(201).json({ userId: result.insertId, email, name, token });
    });
  });
};

const signIn = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs,please double check them.", 500));
  }

  const { email, password } = req.body;

  // check if this email exists or not .

  const query = `SELECT * FROM users WHERE email = "${email}"`;
  con.query(query, async (err, user) => {
    if (user.length === 0) {
      return next(
        new HttpError("Sorry,there is no user with provided email.", 500)
      );
    }

    user = user[0];
    const { password: hashedPassword } = user;
    let isTrue;
    try {
      isTrue = await bcrypt.compare(password, hashedPassword);
      console.log(password);
      console.log(isTrue);
    } catch (error) {
      return next(
        new HttpError("Sorry,there is no user with provided email.", 500)
      );
    }
    if (!isTrue) {
      return next(
        new HttpError("Invalid credential,please double check the inputs.", 500)
      );
    }
    let token;
    try {
      token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          name: user.email,
        },
        "it is kinda funny",
        { expiresIn: "1h" }
      );
    } catch (error) {
      return next(new HttpError("Something went wrong,please try again.", 500));
    }
    res
      .status(200)
      .json({ userId: user.id, name: user.name, email: user.email, token });
  });
};

const getPosts = async (req, res, next) => {
  const userId = req.params.id;
  const query = `SELECT * FROM posts where user_id = ${userId}`;
  con.query(query, (err, result) => {
    if (err) {
      return next(new HttpError("Something went wrong,please try again.", 500));
    }
    const posts = result.map((post) => {
      return { postId: post.id, ...post };
    });
    res.status(200).json(posts);
  });
};

exports.signUp = signUp;
exports.signIn = signIn;
exports.getInfo = getInfo;
exports.getPosts = getPosts;
