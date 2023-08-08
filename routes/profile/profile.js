const express = require("express");
const router = express.Router();
const Users = require("../../models/user");
const Posts = require("../../models/post");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const { ensureAuthenticated } = require("../../config/auth");

router.get("/profile", ensureAuthenticated, (req, res) => {
  Posts.find({ author: req.user._id })
      .then((data) => {
        {
          const userData = {
            username: req.user.username,
            email: req.user.email,
            isAdmin: req.user.isAdmin,
            notifications: req.user.notifications.filter(
              notif => notif.from !== req.user.username
            ),
            posts: data,
            page_name: "profile"
          };
          res.render("profile", userData);
        }
      }).catch(err => console.log(err))
});

router.put(
  "/profile",
  ensureAuthenticated,
  //validating user input
  [
    check(
      "username",
      "Must be 4 to 21 chars | first char is alpahbetic | can have - and _"
    )
      .not()
      .isEmpty()
      .isLength({ min: 4, max: 21 })
      .matches(/[a-zA-Z][a-zA-Z0-9-_]{3,20}/),
    check("email", "Please enter a valid email")
      .not()
      .isEmpty()
      .isEmail(),
    check("newPassword", "4+ characters | 1+ digit or special char!")
      .not()
      .isEmpty()
      .isLength({ min: 4 })
      .matches(
        /(?=[#$-/:-?{-~!"^_`\[\]a-zA-Z]*([0-9#$-/:-?{-~!"^_`\[\]]))(?=[#$-/:-?{-~!"^_`\[\]a-zA-Z0-9]*[a-zA-Z])[#$-/:-?{-~!"^_`\[\]a-zA-Z0-9]{4,}/
      )
      .optional({ checkFalsy: true }),
    check("confirmPassword", "Password do not match!")
      .custom((value, { req }) => value === req.body.newPassword)
      .optional({ checkFalsy: true })
  ],
  (req, res) => {
    const errors = validationResult(req);
    //if validation found errors then display them to user
    if (!errors.isEmpty()) {
      res.send({
        error: {
          title: "Error!",
          body: errors.array()[0].msg
        }
      });
    } else {
      // check if password and confirm password exist
      if (req.body.newPassword && req.body.confirmPassword) {
        console.log("pessword exists");
        //hash the new password
        bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
          if (err) {
            console.log("profilejs: ", err);
          }
          const updated = {
            username: req.body.username,
            email: req.body.email,
            password: hash
          };
          Users.findByIdAndUpdate({ _id: req.user._id }, updated, {
            useFindAndModify: false
          })
            .then(data => {
              res.send({
                success: {
                  title: "Success!",
                  body: "Your password is updated."
                }
              });
            })
            .catch(err => {
              console.log("Error: ", err);
            });
        });
      } else {
        //if new password don't exist ten edit the rest
        const updated = {
          username: req.body.username,
          email: req.body.email
        };
        //update this users data
        Users.findByIdAndUpdate({ _id: req.user._id }, updated, {
          useFindAndModify: false
        })
          .then(data => {
            res.send({
              success: {
                title: "Success!",
                body: "Your info has been updated"
              }
            });
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
);

module.exports = router;
