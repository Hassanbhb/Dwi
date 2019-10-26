const express = require("express");
const router = express.Router();
const { checkNotAuthenticated } = require("../config/auth");

router.get("/", checkNotAuthenticated, (req, res) => {
  res.render("index");
});

module.exports = router;
