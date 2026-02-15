const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  let token;

  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    token = authHeader;
  }

  try {
    const decoded = jwt.verify(token.trim(), process.env.JWT_SECRET);
    console.log("Decoded:", decoded);

    req.admin = decoded.adminId; // ✅ FIXED HERE

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
