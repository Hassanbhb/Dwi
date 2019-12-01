const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("auth");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send({
        error: {
          title: "Whooops",
          body: "Email or password is Wrong"
        }
      });
    }
    req.login(user, err => {
      if (err) {
        return next(err);
      }
      return res.send({ success: "Welcome back" });
    });
  })(req, res, next);
});

module.exports = router;
