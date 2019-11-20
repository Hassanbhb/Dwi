const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../../config/auth");
const Posts = require("../../models/post");
const moment = require("moment");
const { check, validationResult } = require("express-validator");

// Get All posts
router.get("/", ensureAuthenticated, (req, res) => {
  // find all posts, and populate the author and the comments author
  //to keep data updated
  Posts.find({})
    .populate({
      path: "comments.author",
      model: "User"
    })
    .populate("author", "_id name lastName")
    .then(posts => {
      // then render the posts
      res.render("dashboard", { user: req.user._id, posts });
    })
    .catch(err => {
      console.log(err);
    });
});

//create new posts
router.post(
  "/new/post",
  ensureAuthenticated,
  [
    check("newPost", "field must not be empty")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .exists({ checkFalsy: true })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", `${errors.array()[0].msg}`);
      res.redirect("/dashboard");
    } else {
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
        req.flash("success", "Posted successfully");
        res.redirect("/dashboard");
      });
    }
  }
);

//delete Post
router.delete("/delete/post", ensureAuthenticated, (req, res) => {
  Posts.findByIdAndDelete({ _id: req.body.postId })
    .then(deletedPost => {
      req.flash("success", "Post Deleted Successfully");
      res.send("deleted post");
    })
    .catch(err => {
      console.error(err);
    });
});

//edit post to add a comment to it
router.put(
  "/new/comment",
  ensureAuthenticated,
  [
    check("comment", "field must not be empty")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .exists({ checkFalsy: true })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", `${errors.array()[0].msg}`);
      res.redirect("/dashboard");
    } else {
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
          req.flash("success", "Commented successfully");
          res.redirect("/dashboard");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
);

//edit post to add a like to it
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

// edit posts body
router.put(
  "/edit/post",
  ensureAuthenticated,
  [
    check("editedText", "field must not be empty")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .exists({ checkFalsy: true })
  ],
  (req, res) => {
    // TODO: validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", `${errors.array()[0].msg}`);
      res.redirect("/dashboard");
    } else {
      Posts.findByIdAndUpdate(
        { _id: req.body.postId },
        { body: req.body.editedText },
        { new: true, useFindAndModify: false }
      )
        .then(editedPost => {
          res.redirect("/dashboard");
        })
        .catch(err => console.error(err));
    }
  }
);

//delete a comment from post
router.put("/delete/comment", ensureAuthenticated, (req, res) => {
  const data = req.body.postId.split(" ");
  const postId = data[0];
  const commentId = data[1];
  console.log(commentId);
  Posts.findByIdAndUpdate(
    { _id: postId },
    { $pull: { comments: { _id: commentId } } },
    { new: true, useFindAndModify: false }
  )
    .then(editedPost => {
      console.log(editedPost);
      req.flash("success", "Comment deleted successfully");
      res.send("deleted comment");
    })
    .catch(err => {
      console.error(err);
    });
});

module.exports = router;
