const express = require("express");
const router = express.Router();
const postsControllers = require("../controllers/posts-controllers");
const fileUpload = require("../middleware/file-upload") ;
const { check } = require("express-validator");

router.post("/new", [check("post").not().isEmpty()], postsControllers.addPost);

router.post("/newWithPhoto", fileUpload.single("post_image"),[check("post").not().isEmpty()], postsControllers.addPostWithPhoto);

router.get("/:id", postsControllers.getPost);

router.post("/newComment", postsControllers.newComment);

router.get("/:id/comments", postsControllers.getComments);

router.post("/like", postsControllers.like);

router.post("/dislike", postsControllers.dislike);

module.exports = router;
