const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(
      new HttpError("Fetching users failed, please try again later.", 422)
    );
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  console.log("here");
  const { name, email, password } = req.body;

  console.log(req.body) ; 

  let exist;
  try {
    exist = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Something went wrong.", 500));
  }

  if (exist) {
    return next(new HttpError("this email is already exists", 500));
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    const err = new HttpError("Could not create a user.", 500);
    return next(err);
  }
  const user = new User({
    name,
    email,
    password: hashedPassword,
    image: req.file.path,
    places: [],
  });

  try {
    await user.save();
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
  return;
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let exist;
  try {
    exist = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Something went wrong.", 500));
  }
  if (!exist) {
    return next(new HttpError("Invalid credentials,couldn't log you in.", 401));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, exist.password);
  } catch (error) {
    return next(new HttpError("could not log you in , wrong credentials", 500));
  }
  if (!isValidPassword) {
    return next(new HttpError("Invalid credentials,couldn't log you in.", 401));
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
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
