const express = require("express");
const router = express.Router();

router.get("/logout", (req, res) => {
  req.logout();
  console.log("user loged out");
  res.redirect("/");
});

module.exports = router;
