const express = require("express");
const passport = require("passport");
const router = express.Router();

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/",
    successRedirect: "/dashboard"
  })
);

module.exports = router;
