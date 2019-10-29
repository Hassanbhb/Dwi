const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../../config/auth");
const Posts = require("../../models/post");
const moment = require("moment");

router.get("/", ensureAuthenticated, (req, res) => {
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

//TODO: check if same user liked the post id so decrement
router.put("/new/like", ensureAuthenticated, (req, res) => {
  Posts.findById({ _id: req.body.postId }, "likes")
    .then(post => {
      if (post.likes.indexOf(req.user._id) === -1) {
        //user didn't like the post before
        Posts.findByIdAndUpdate(
          { _id: req.body.postId },
          { $push: { likes: req.user._id } },
          { new: true, useFindAndModify: false }
        ).then(updatedPost => {
          res.send("add");
        });
      } else {
        //user already liked post
        Posts.findByIdAndUpdate(
          { _id: req.body.postId },
          { $pull: { likes: req.user._id } },
          { new: true, useFindAndModify: false }
        ).then(updatedPost => {
          res.send("sub");
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
