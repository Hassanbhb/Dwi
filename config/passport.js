const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

//load user model
const User = require("../models/user");

module.exports = function(passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true
      },
      function(req, email, password, done) {
        // TODO: validate input
        User.findOne({ email: email }, function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(
              null,
              false,
              req.flash("error", "Email or password is incorrect")
            );
          }
          //compare passwords
          bcrypt.compare(password, user.password, (err, res) => {
            if (err) throw err;
            //if don't match send error
            if (!res) {
              return done(
                null,
                false,
                req.flash("error", "Email or password is incorrect")
              );
            }
            return done(null, user);
          });
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
