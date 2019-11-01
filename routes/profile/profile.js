const express = require("express");
const router = express.Router();
const Users = require("../../models/user");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
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
router.put(
  "/profile",
  ensureAuthenticated,
  //validating user input
  [
    check("firstName", "Name must be Alphanumeric")
      .trim()
      .escape()
      .isLength({ min: 2 }),
    check("lastName", "last name must be Alphanumeric")
      .trim()
      .escape()
      .isLength({ min: 2 }),
    check("email", "Please enter a valid email")
      .not()
      .isEmpty()
      .isEmail(),
    check("newPassword", "Password must have 5+ chars and at least one number")
      .not()
      .isEmpty()
      .isLength({ min: 5 })
      .matches(/\d/)
      .optional({ checkFalsy: true }),
    check("confirmPassword", "Passwords don't match")
      .custom((value, { req }) => value === req.body.newPassword)
      .optional({ checkFalsy: true })
  ],
  (req, res) => {
    const errors = validationResult(req);
    //if validation found errors then display them to user
    if (!errors.isEmpty()) {
      req.flash("error", `${errors.array()[0].msg}`);
      res.redirect("/profile");
    } else {
      // check if password and confirm password exist
      if (req.body.newPassword && req.body.confirmPassword) {
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
              req.flash("success", "Profile Updated successfully");
              res.redirect("/profile");
            })
            .catch(err => {
              console.log("Error: ", err);
            });
        });
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
            req.flash("success", "Profile Updated successfully");
            res.redirect("/profile");
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
);

module.exports = router;
