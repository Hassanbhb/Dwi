const express = require("express");
const router = express.Router();
const Posts = require("../../models/post");
const { ensureAuthenticated } = require("../../config/auth");

router.get("/", ensureAuthenticated, (req, res) => {
  Posts.find({})
    .populate("author", "username")
    .then(data => {
      const Data = {
        username: req.user.username,
        email: req.user.email,
        isAdmin: req.user.isAdmin,
        posts: data
      };
      res.render("controle", Data);
    })
    .catch(err => console.error(err));
});

router.delete("/delete", ensureAuthenticated, (req, res) => {
  Posts.findOneAndDelete({ _id: req.body.postId })
    .then(post => {
      res.send({
        success: {
          title: "Success!!",
          body: "Post Deleted"
        }
      });
    })
    .catch(err => console.error(err));
});

module.exports = router;
