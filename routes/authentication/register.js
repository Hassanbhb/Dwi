const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../../models/user");

router.post("/register", (req, res) => {
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
          console.log("success");
          req.flash("success", "success, you can login now");
          res.redirect("/");
        });
      });
    }
  });
});

module.exports = router;
