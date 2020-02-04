const express = require("express");
const passport = require("passport");
const { checkNotAuthenticated } = require("../../config/auth");
const router = express.Router();

router.get("/", checkNotAuthenticated, (req, res) => {
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

router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/dashboard"
  })
);

module.exports = router;
