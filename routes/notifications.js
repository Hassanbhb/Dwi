const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const Users = require("../models/user");

router.get("/", ensureAuthenticated, (req, res) => {
  Users.findById(req.user._id)
    .then(user => {
      const notifications = user.notifications.filter(
        notif => notif.from !== req.user.username
      );
      const data = {
        username: req.user.username,
        isAdmin: req.user.isAdmin,
        page_name: "notifications",
        notifications
      };
      res.render("notifications", { data });
    })
    .catch(err => console.error(err));
});

router.delete("/", ensureAuthenticated, (req, res) => {
  Users.findOneAndUpdate(
    { _id: req.user._id },
    {
      $pull: { notifications: { _id: req.body.notifID } }
    },
    { new: true, useFindAndModify: false }
  ).then(editedNotif => {
    res.send("deleted notification");
  });
});

module.exports = router;
