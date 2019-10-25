const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../../config/auth");
const Posts = require("../../models/post");
const Users = require("../../models/user");
const moment = require("moment");

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  Posts.find({})
    .then(posts => {
      res.render("dashboard", { posts });
    })
    .catch(err => {
      console.log(err);
    });
});

//create new posts
router.post("/new/post", ensureAuthenticated, (req, res) => {
  //TODO: validate input
  const newPost = {
    body: req.body.newPost,
    comments: [],
    createdAt: moment().fromNow(),
    createdBy: `${req.user.name} ${req.user.lastName}`
  };
  const post = new Posts(newPost);
  post.save(err => {
    if (err) {
      console.error("Error creating post");
      return err;
    }
    res.redirect("/dashboard");
  });
});

module.exports = router;
