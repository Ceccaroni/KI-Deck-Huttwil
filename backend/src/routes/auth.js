import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", (req, res) => {
  const { password } = req.body;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Falsches Passwort" });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.ADMIN_PASSWORD,
    { expiresIn: "8h" }
  );

  return res.json({ token });
});

export default router;
