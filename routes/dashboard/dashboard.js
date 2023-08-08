const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../../config/auth");
const Posts = require("../../models/post");
const Users = require("../../models/user");
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
    .populate("likes", "username")
    .populate("author", "_id username")
    .then(posts => {
      // then render the posts
      res.render("dashboard", {
        user: {
          _id: req.user._id,
          username: req.user.username,
          isAdmin: req.user.isAdmin,
          notifications: req.user.notifications.filter(
            notif => notif.from !== req.user.username
          )
        },
        posts,
        page_name: "dashboard"
      });
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
      .isLength({ max: 3000 })
      .withMessage("Posts must be 3000 characters or less")
      .trim()
      .exists({ checkFalsy: true })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send({
        error: {
          title: "Error",
          body: errors.array()[0].msg
        }
      });
    } else {
      const newPost = {
        body: req.body.newPost,
        comments: [],
        createdAt: moment().format("DD/MM/YYYY, h:mm a"),
        author: req.user._id
      };
      const post = new Posts(newPost);
      post.save()
          .then(() => {
            res.send({
              success: {
                title: "Posted successfully!",
                body: "👌"
              }
            });
          })
          .catch(err => {
            console.log("Error when creating new post: ", err);
          })
    }
  }
);

//delete Post
router.delete("/delete/post", ensureAuthenticated, (req, res) => {
  Posts.findByIdAndDelete({ _id: req.body.postId })
    .then(deletedPost => {
      res.send({
        success: {
          title: "Post Deleted!",
          body: "Successfully!"
        }
      });
    })
    .catch(err => {
      console.error(err);
    });
});

//edit post to add a comment to it and add a notification to the post owner
router.put(
  "/new/comment",
  ensureAuthenticated,
  [
    check("comment", "field must not be empty")
      .not()
      .isEmpty()
      .isLength({ max: 250 })
      .withMessage("Comment must be 250 characters or less")
      .trim()
      .exists({ checkFalsy: true })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send({
        error: {
          title: "Error",
          body: errors.array()[0].msg
        }
      });
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
          const notification = {
            from: req.user.username,
            when: moment().format("DD/MM/YYYY, h:mm a"),
            title: `${req.user.username} commented on your post`
          };
          Users.findByIdAndUpdate(
            updatedPost.author,
            {
              $push: { notifications: notification }
            },
            { new: true, useFindAndModify: false }
          ).then(user => {
            res.send({
              success: {
                title: "Comented successfully!",
                body: "👌"
              }
            });
          });
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
      .exists({ checkFalsy: true })
  ],
  (req, res) => {
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
  Posts.findByIdAndUpdate(
    { _id: postId },
    { $pull: { comments: { _id: commentId } } },
    { new: true, useFindAndModify: false }
  )
    .then(editedPost => {
      res.send("deleted comment");
    })
    .catch(err => {
      console.error(err);
    });
});

module.exports = router;
