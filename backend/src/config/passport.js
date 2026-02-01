const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Google may not give phone — so we store Google ID as phone fallback
        let user = await User.findOne({ phone: profile.id });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            phone: profile.id, // unique fallback
            role: "USER",
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// session serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
