import jwt from "jsonwebtoken";
import Admin from "../models/Admin.model.js";

const generateToken = (admin) => {
  return jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.ADMIN_JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken(admin);

  res.json({
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      role: admin.role
    }
  });
};
