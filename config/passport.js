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
        User.findOne({ email: email })
            .then((user) => {
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
            })
            .catch(err => done(err))
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
                // check if another user with this email or username exist
                User.findOne({
                  $or: [
                    { email: profile.emails[0].value },
                    { username: profile.displayName }
                  ]
                })
                  .then(user => {
                    // if no user has this email or username create a new one
                    if (!user) {
                      const newUser = new User();
                      newUser.username = profile.displayName;
                      newUser.email = profile.emails[0].value;
                      newUser.google.token = accessToken;
                      newUser.google.id = profile.id;

                      newUser.save()
                      .then(() => {
                        return done(null, newUser);
                      })
                      .catch(err => {
                        throw err
                      })
                    } else {
                      // else update the existing one to link google to it
                      const googleData = {
                        token: accessToken,
                        id: profile.id
                      };
                      User.findByIdAndUpdate(
                        { _id: user._id },
                        { google: googleData },
                        { new: true }
                      )
                        .then(user => {
                          done(null, user);
                        })
                        .catch(err => done(err));
                    }
                  })
                  .catch(err => done(err));
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
    User.findById(id)
        .then(user => done(null, user))
        .catch(err => done(err))
  });
};
