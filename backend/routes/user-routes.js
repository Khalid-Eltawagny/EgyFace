const express = require("express");
const { check } = require("express-validator");
const userControllers = require("../controllers/user-controllers");

const router = express.Router();

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("password").isLength({ min: 6 }),
    check("email").isEmail(),
  ],
  userControllers.signUp
);

router.post(
  "/signin",
  [check("email").not().isEmpty(), check("password").not().isEmpty()],
  userControllers.signIn
);

router.get("/:id/info",userControllers.getInfo) ; 

router.get("/:id/posts",userControllers.getPosts)

module.exports = router;
