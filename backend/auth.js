const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // bypass querying in db for now
      // supposedly we check if the user exists here
      if (profile) {
        console.log(profile);
      }
      done(null, profile);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // bypass querying in db for now
  // supposedly we query the db to retrieve user data
  done(null, id);
});

const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

const googleAuthCallback = (req, res) => {
  // redirect to the backend root after login for now,
  // in the future send a response to the frontend
  res.redirect("http://localhost:3000");
};

const logout = (req, res) => {
  // req.logout();
  req.user = null;
  req.session = null;
  // redirect to the backend root after login for now,
  // in the future send a response to the frontend
  res.redirect("http://localhost:3000");
};

module.exports = { googleAuth, googleAuthCallback, logout };
