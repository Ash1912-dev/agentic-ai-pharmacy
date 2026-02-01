const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("./config/passport");

const routes = require("./routes");
const whatsappRoutes = require("./routes/whatsapp.routes");

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,               // allow cookies
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔐 SESSION FIRST
app.use(
  session({
    secret: "agentic-ai-pharmacy",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",   // ✅ REQUIRED for localhost
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
