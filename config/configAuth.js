module.exports = {
  googleAuth: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.APP_URL + "/auth/google/callback"
  }
};
