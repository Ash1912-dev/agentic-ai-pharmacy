const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User.model");

const normalizeUrl = (url) => {
  if (!url) return null;
  return url.trim().replace(/\/$/, "");
};

const isLocalhostUrl = (url) => {
  if (!url) return false;
  try {
    const { hostname } = new URL(url);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
};

const backendBaseUrl =
  normalizeUrl(process.env.BACKEND_URL) ||
  normalizeUrl(process.env.RENDER_EXTERNAL_URL) ||
  `http://localhost:${process.env.PORT || 5000}`;

const configuredGoogleCallbackUrl = normalizeUrl(process.env.GOOGLE_CALLBACK_URL);
const shouldIgnoreConfiguredCallback =
  process.env.NODE_ENV === "production" &&
  isLocalhostUrl(configuredGoogleCallbackUrl);

const googleCallbackUrl =
  (shouldIgnoreConfiguredCallback ? null : configuredGoogleCallbackUrl) ||
  `${backendBaseUrl}/api/auth/google/callback`;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: googleCallbackUrl,
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
