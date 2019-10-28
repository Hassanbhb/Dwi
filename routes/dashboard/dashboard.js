const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../../config/auth");
const Posts = require("../../models/post");
const moment = require("moment");

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  // find all posts, and populate the author and the comments author
  //to keep data updated
  Posts.find({})
    .populate({
      path: "comments.author",
      model: "User"
    })
    .populate("author")
    .then(posts => {
      // then render the posts
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
    createdAt: moment().format("l, h:mm a"),
    author: req.user._id
  };
  const post = new Posts(newPost);
  post.save(err => {
    if (err) {
      console.log("Error when creating new post");
    }
    res.redirect("/dashboard");
  });
});

router.put("/new/comment", ensureAuthenticated, (req, res) => {
  const newComment = {
    author: req.user._id,
    text: req.body.comment,
    createdAt: moment().format("l, h:mm a")
  };
  //search for the post the user commented on
  //and add the new comment to the array of comments
  Posts.findOneAndUpdate(
    { _id: req.body.postId },
    { $push: { comments: newComment } },
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
