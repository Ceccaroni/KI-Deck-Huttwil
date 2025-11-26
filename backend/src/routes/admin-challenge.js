import express from "express";
import { loadJson, saveJson } from "../services/storage.js";

const router = express.Router();

// GET
router.get("/", async (req, res, next) => {
  try {
    const data = await loadJson("challenge.json");
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// UPDATE (nur eine Challenge)
router.put("/", async (req, res, next) => {
  try {
    const data = req.body;
    await saveJson("challenge.json", data);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
