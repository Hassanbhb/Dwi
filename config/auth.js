module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/");
    }
  },
  checkNotAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect("/dashboard");
    } else {
      next();
    }
  }
};
