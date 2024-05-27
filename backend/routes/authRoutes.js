const express = require("express");
const passport = require("passport");
const { googleAuth, googleAuthCallback, logout } = require("../auth");

const router = express.Router();

router.get("/google", googleAuth);
router.get(
  "/google/callback",
  passport.authenticate("google"),
  googleAuthCallback,
);
router.get("/google/logout", logout);

module.exports = router;
