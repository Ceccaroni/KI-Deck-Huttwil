import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import publicRoutes from "./routes/public.js";
import authRoutes from "./routes/auth.js";
import adminQaRoutes from "./routes/admin-qa.js";
import adminNewsRoutes from "./routes/admin-news.js";
import adminChallengeRoutes from "./routes/admin-challenge.js";
import adminTicketsRoutes from "./routes/admin-tickets.js";

import adminOnly from "./middleware/adminOnly.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Public (Landing Page)
app.use("/api", publicRoutes);

// Auth
app.use("/api/auth", authRoutes);

// Admin (CRUD)
app.use("/api/admin/qa", adminOnly, adminQaRoutes);
app.use("/api/admin/news", adminOnly, adminNewsRoutes);
app.use("/api/admin/challenge", adminOnly, adminChallengeRoutes);
app.use("/api/admin/tickets", adminOnly, adminTicketsRoutes);

// Error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("KI-Deck Backend läuft auf Port", PORT);
});
