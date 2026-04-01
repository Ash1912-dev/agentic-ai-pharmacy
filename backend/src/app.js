const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("./config/passport");

const routes = require("./routes");
const whatsappRoutes = require("./routes/whatsapp.routes");

const app = express();

const normalizeOrigin = (url) => {
  if (!url) return null;
  return url.trim().replace(/\/$/, "");
};

const allowedOrigins = new Set(
  [
    "http://localhost:5173",
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGIN,
  ]
    .map(normalizeOrigin)
    .filter(Boolean)
);

const isVercelPreviewDomain = (origin) => {
  try {
    const host = new URL(origin).hostname;
    return host.endsWith(".vercel.app");
  } catch {
    return false;
  }
};

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      const normalizedOrigin = normalizeOrigin(origin);

      if (
        !normalizedOrigin ||
        allowedOrigins.has(normalizedOrigin) ||
        isVercelPreviewDomain(normalizedOrigin)
      ) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔐 SESSION FIRST
app.use(
  session({
    secret: process.env.SESSION_SECRET || "agentic-ai-pharmacy",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// 🔐 PASSPORT AFTER SESSION
app.use(passport.initialize());
app.use(passport.session());

// 🚀 ROUTES AFTER PASSPORT
app.use(routes);
app.use("/api/whatsapp", whatsappRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Agentic AI Pharmacy backend is running",
  });
});

module.exports = app;
