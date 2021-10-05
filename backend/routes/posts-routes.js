const express = require("express");
const router = express.Router();
const postsControllers = require("../controllers/posts-controllers");
const { check } = require("express-validator");

router.post("/new", [check("post").not().isEmpty()], postsControllers.addPost);

module.exports = router;
