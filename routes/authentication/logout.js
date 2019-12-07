const express = require("express");
const router = express.Router();

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth");
});

module.exports = router;
