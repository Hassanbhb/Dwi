const express = require("express");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../../models/user");

router.post(
  "/register",
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
    check("password", "4+ characters | 1+ digit or special char!")
      .not()
      .isEmpty()
      .isLength({ min: 4 })
      .matches(
        /(?=[#$-/:-?{-~!"^_`\[\]a-zA-Z]*([0-9#$-/:-?{-~!"^_`\[\]]))(?=[#$-/:-?{-~!"^_`\[\]a-zA-Z0-9]*[a-zA-Z])[#$-/:-?{-~!"^_`\[\]a-zA-Z0-9]{4,}/
      ),
    check("confirmPassword", {
      title: "Passwords do not match!",
      body: "Please confirm your password."
    }).custom((value, { req }) => value === req.body.password)
  ],
  (req, res) => {
    const errors = validationResult(req);
    //if validation found errors then display them to user
    if (!errors.isEmpty()) {
      res.send({ error: errors.array()[0].msg });
    } else {
      //check if a user has the same username or email
      User.findOne(
        { $or: [{ 'email': req.body.email }, { 'username': req.body.username }] },
      ).then((user) => {
        //if user with this email or username exists
        if (user) {
          // return error if user has the same email or the same username
          if (user.email === req.body.email) {
            res.send({
              error: {
                title: "Email already exists!",
                body: "Please login or use a new email"
              }
            });
          } else if (user.username === req.body.username) {
            res.send({
              error: {
                title: "Username already exists!",
                body: "Please try again."
              }
            });
          }
        } else {
          const newUser = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
          };
          //hash password
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            newUser.password = hash;
            const user = new User(newUser);
            user.save()
                .then(() => {
                  res.send({
                    success: {
                      title: "Success",
                      body: "You can login now 👌"
                    }
                  });
                })
                .catch(err => {
                  console.log(err)
                  res.send({
                    error: {
                      title: "Error!",
                      body: "please try again!"
                    }
                  });
                  
                })
          });
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
);

module.exports = router;
