const express = require("express");
const passport = require("passport");
const router = express.Router();

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/"
  }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

module.exports = router;
