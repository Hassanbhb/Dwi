const express = require("express");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../../models/user");

router.post(
  "/register",
  //validating user input
  [
    check("name", "Name must be Alphanumeric")
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
    check("password", "Password must have 5+ chars and at least one number")
      .not()
      .isEmpty()
      .isLength({ min: 5 })
      .matches(/\d/),
    check("confirmPassword", "Passwords don't match").custom(
      (value, { req }) => value === req.body.password
    )
  ],
  (req, res) => {
    const errors = validationResult(req);
    //if validation found errors then display them to user
    if (!errors.isEmpty()) {
      req.flash("error", `${errors.array()[0].msg}`);
      res.redirect("/");
    } else {
      //check if user already exists
      User.findOne({ email: req.body.email }, (err, user) => {
        if (err) console.log(err);
        //if user with this email exists
        if (user) {
          // return an error
          req.flash("error", "Email already exists!");
          res.redirect("/");
        } else {
          //TODO: validate input
          const newUser = {
            name: req.body.name,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
          };
          //hash password
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            newUser.password = hash;
            const user = new User(newUser);
            user.save(err => {
              if (err) {
                req.flash("error", "An Error happened, please try again!");
                res.redirect("/");
              }
              req.flash("success", "success, you can login now");
              res.redirect("/");
            });
          });
        }
      });
    }
  }
);

module.exports = router;
