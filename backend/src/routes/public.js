import express from "express";
import { loadJson } from "../services/storage.js";

const router = express.Router();

// Q&A
router.get("/qa", async (req, res, next) => {
  try {
    const data = await loadJson("qa.json");
    res.json(data.items || []);
  } catch (err) {
    next(err);
  }
});

// News
router.get("/news", async (req, res, next) => {
  try {
    const data = await loadJson("news.json");
    res.json(data.items || []);
  } catch (err) {
    next(err);
  }
});

// Challenge
router.get("/challenge", async (req, res, next) => {
  try {
    const data = await loadJson("challenge.json");
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Tickets (nur erstellen)
router.post("/ticket", async (req, res, next) => {
  try {
    const ticket = req.body;
    const id = `ticket_${Date.now()}`;

    await client.putFileContents(
      `${process.env.NEXTCLOUD_ROOT_PATH}/tickets/${id}.json`,
      JSON.stringify({ id, ...ticket }, null, 2),
      { overwrite: true }
    );

    res.json({ ok: true, id });
  } catch (err) {
    next(err);
  }
});

export default router;
