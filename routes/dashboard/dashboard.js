const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../../config/auth");
const Posts = require("../../models/post");
const Users = require("../../models/user");
const moment = require("moment");

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  const userName = `${req.user.name} ${req.user.lastName}`;
  Posts.find({})
    .then(posts => {
      res.render("dashboard", { userName, posts });
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
    createdAt: moment().format("l, h:mm a"),
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

router.put("/new/comment", ensureAuthenticated, (req, res) => {
  const comment = {
    author: req.body.author,
    text: req.body.comment,
    createdAt: moment().format("l, h:mm a")
  };
  //search for the post the user commented on
  //and add the new comment to the array of comments
  Posts.findOneAndUpdate(
    { _id: req.body.postId },
    { $push: { comments: comment } },
    { new: true, useFindAndModify: false }
  )
    .then(updatedPost => {
      res.redirect("/dashboard");
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
