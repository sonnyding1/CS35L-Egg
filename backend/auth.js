const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();
const User = require("./models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // bypass querying in db for now
      // supposedly we check if the user exists here
      try {
        if (profile) {
          console.log(profile);
          const profileJSON = profile._json;
          const newUser = new User({
            name: profileJSON.given_name,
            email: profileJSON.email,
            username: profileJSON.sub, // username is set to Google ID by default, can change later
            password: "foo",
            dateCreated: Date.now(),
          });

          try {
            const savedUser = await newUser.save();
            console.log("New user created: " + savedUser);
          } catch (err) {
            console.log("User already exists! Details: " + err);
          }
        }
      } catch (err) {
        console.err("Error:", err);
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

const googleAuthCallback = async (req, res) => {
  // redirect to the backend root after login for now,
  // in the future send a response to the frontend
  // res.redirect("http://localhost:3000");
  newUser = await User.findOne({username: req.session.passport.user}).exec();
  req.session.userId = newUser._id;
  return res.json(req.session);
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
