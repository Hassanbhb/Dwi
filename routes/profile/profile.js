const express = require("express");
const router = express.Router();
const Users = require("../../models/user");
const bcrypt = require("bcrypt");
const { ensureAuthenticated } = require("../../config/auth");

router.get("/profile", ensureAuthenticated, (req, res) => {
  const userData = {
    firstName: req.user.name,
    lastName: req.user.lastName,
    email: req.user.email
  };
  res.render("profile", userData);
});

//TODO: split to two, so that we can update posts
//the user wrote
router.put("/profile", ensureAuthenticated, (req, res) => {
  // check if password and confirm password exist
  if (req.body.newPassword && req.body.confirmPassword) {
    //check if they are equal
    if (req.body.newPassword === req.body.confirmPassword) {
      //hash the new password
      bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
        if (err) {
          console.log("profilejs: ", err);
        }
        const updated = {
          name: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hash
        };
        Users.findByIdAndUpdate({ _id: req.user._id }, updated, {
          useFindAndModify: false
        })
          .then(data => {
            res.redirect("/profile");
          })
          .catch(err => {
            console.log("Error: ", err);
          });
      });
    } else {
      res.send("Error: Passwords don't match");
    }
  } else {
    //if new password don't exist ten edit the rest
    const updated = {
      name: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
    };
    //update this users data
    Users.findByIdAndUpdate({ _id: req.user._id }, updated, {
      useFindAndModify: false
    })
      .then(data => {
        res.redirect("/profile");
      })
      .catch(err => {
        console.log(err);
      });
  }
});

module.exports = router;
