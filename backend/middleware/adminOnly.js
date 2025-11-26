import jwt from "jsonwebtoken";

export default function adminOnly(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Nicht eingeloggt" });
  }

  try {
    const payload = jwt.verify(token, process.env.ADMIN_PASSWORD);
    if (!payload || payload.role !== "admin") {
      throw new Error("Token ungültig");
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Zugriff verweigert" });
  }
}
