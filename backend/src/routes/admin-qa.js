import express from "express";
import { loadJson, saveJson } from "../services/storage.js";

const router = express.Router();

// LISTE
router.get("/", async (req, res, next) => {
  try {
    const data = await loadJson("qa.json");
    res.json(data.items || []);
  } catch (err) {
    next(err);
  }
});

// CREATE
router.post("/", async (req, res, next) => {
  try {
    const data = await loadJson("qa.json");
    const newItem = { id: `qa_${Date.now()}`, ...req.body };
    data.items.push(newItem);
    await saveJson("qa.json", data);
    res.json(newItem);
  } catch (err) {
    next(err);
  }
});

// UPDATE
router.put("/:id", async (req, res, next) => {
  try {
    const data = await loadJson("qa.json");
    const idx = data.items.findIndex(x => x.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Nicht gefunden" });

    data.items[idx] = { ...data.items[idx], ...req.body };
    await saveJson("qa.json", data);
    res.json(data.items[idx]);
  } catch (err) {
    next(err);
  }
});

// DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    const data = await loadJson("qa.json");
    data.items = data.items.filter(x => x.id !== req.params.id);
    await saveJson("qa.json", data);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
