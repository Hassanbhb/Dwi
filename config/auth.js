module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      console.log("user is authenticated");
      return next();
    } else {
      res.redirect("/");
    }
  }
};
