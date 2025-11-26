export default function errorHandler(err, req, res, next) {
  console.error("API ERROR:", err);
  res.status(500).json({ error: "Serverfehler", details: err.message });
}
