const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/auth", (req, res) => {
  res.render("auth");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/",
    successRedirect: "/dashboard"
  })
);

module.exports = router;
