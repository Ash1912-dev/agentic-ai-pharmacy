const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin.model");

exports.adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Admin authorization required" });
    }

    const token = authHeader.split(" ")[1];

    // ✅ MUST MATCH adminLogin
    const decoded = jwt.verify(
      token,
      process.env.ADMIN_JWT_SECRET
    );

    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: "Admin access denied" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    return res.status(401).json({ message: "Invalid or expired admin token" });
  }
};
