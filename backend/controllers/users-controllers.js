const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Kh@lid0100123123",
  database: "places_application",
});

con.connect((err) => {
  if (err) throw new Error("Couldn't connect to the database!!");
});

const getUsers = async (req, res, next) => {
  const query = "SELECT * FROM users";
  con.query(query, async (err, result) => {
    if (err) {
      return next(
        new HttpError("Fetching users failed, please try again later.", 422)
      );
    }
    let users;

    const promises = result.map((user) => {
      return new Promise((resolve, reject) => {
        const q = "SELECT * FROM user_places WHERE user_id = " + user.id;
        con.query(q, async (err, result) => {
          if (err) {
            reject(err);
          }
          const full_user = { ...user, password: undefined, places: result };
          return resolve(full_user);
        });
      });
    });
    users = await Promise.all(promises);
    res.json({ users });
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password } = req.body;
  const query = `SELECT * FROM users WHERE email = "${email}"`;

  con.query(query, async (err, result) => {
    if (err) {
      return next(new HttpError("Something went wrong", 500));
    }
    if (result.length > 0) {
      return next(new HttpError("this email is already exists", 500));
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (error) {
      const err = new HttpError("Could not create a user.", 500);
      return next(err);
    }
    const user = {
      name,
      email,
      password: hashedPassword,
      image: req.file.path,
    };

    try {
      const query = "INSERT INTO users SET ?";
      con.query(query, user, (err, result) => {
        if (err) throw new Error();
      });
    } catch (error) {
      return next(new HttpError("Something went wrong.", 500));
    }
    let token;
    try {
      token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        "supersecret_dont_share",
        { expiresIn: "1h" }
      );
    } catch (error) {
      return next(new HttpError("Something went wrong.", 500));
    }

    res.status(201).json({ userId: user.id, email: user.email, token: token });
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  con.query(query, async (err, result) => {
    if (err) {
      console.log(err);
      return next(new HttpError("Something went wrong.", 500));
    }
    if (result.length === 0) {
      return next(
        new HttpError("Invalid credentials,couldn't log you in.", 401)
      );
    }
    let isValidPassword = false;
    let exist = result[0];
    try {
      isValidPassword = await bcrypt.compare(password, exist.password);
    } catch (error) {
      return next(
        new HttpError("could not log you in , wrong credentials", 500)
      );
    }
    if (!isValidPassword) {
      return next(
        new HttpError("Invalid credentials,couldn't log you in.", 401)
      );
    }
    let token;
    try {
      token = jwt.sign(
        {
          userId: exist.id,
          email: exist.email,
        },
        "supersecret_dont_share",
        { expiresIn: "1h" }
      );
    } catch (error) {
      return next(new HttpError("Something went wrong.", 500));
    }
    res.json({ userId: exist.id, email: exist.email, token: token });
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
