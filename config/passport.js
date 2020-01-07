const LocalStrategy = require("passport-local");
const GoogleStratey = require("passport-google-oauth").OAuth2Strategy;
const configAuth = require("./configAuth");
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
        User.findOne({ email: email }, function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false);
          }
          //compare passwords
          if (user.password) {
            bcrypt.compare(password, user.password, (err, res) => {
              if (err) throw err;
              //if don't match send error
              if (!res) {
                return done(null, false);
              }
              return done(null, user);
            });
          } else {
            return done(null, false);
          }
        });
      }
    )
  );

  passport.use(
    new GoogleStratey(
      {
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL
      },
      function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
          User.findOne({ "google.id": profile.id })
            .then(user => {
              if (user) {
                return done(null, user);
              } else {
                const newUser = new User();
                newUser.username = profile.displayName;
                newUser.email = profile.emails[0].value;
                newUser.google.username = profile.displayName;
                newUser.google.email = profile.emails[0].value;
                newUser.google.token = accessToken;
                newUser.google.id = profile.id;

                newUser.save(function(err) {
                  if (err) {
                    throw err;
                  }
                  return done(null, newUser);
                });
              }
            })
            .catch(err => done(err));
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
