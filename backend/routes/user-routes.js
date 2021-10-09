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

router.post("/friendrequest", userControllers.friendReq);

router.get("/:id/info", userControllers.getInfo);

router.get("/:id/posts", userControllers.getPosts);

router.get("/:id/friends", userControllers.getFriends);

router.get("/:id/requests", userControllers.getRequets);

router.post("/acceptrequest", userControllers.acceptReq);

router.post("/declinerequest", userControllers.declineReq);

router.post("/unfriend", userControllers.unfriend);

router.post("/getSinglePost", userControllers.getSinglePost);

router.get("/isLiked/:uid/:pid", userControllers.isLiked);

module.exports = router;
