import express from "express";
import { loadJson, saveJson } from "../services/storage.js";

const router = express.Router();

/*
  NEWS-DATENSTRUKTUR (news.json):
  {
    "items": [
      {
        "id": "news_123456",
        "title": "Titel",
        "body": "Text",
        "created_at": "2025-02-12T09:00:00Z",
        "visible_from": "2025-02-12T00:00:00Z",
        "visible_to": null
      }
    ]
  }
*/

// ALLE NEWS LADEN
router.get("/", async (req, res, next) => {
  try {
    const data = await loadJson("news.json");
    res.json(data.items || []);
  } catch (err) {
    next(err);
  }
});

// NEWS ERSTELLEN
router.post("/", async (req, res, next) => {
  try {
    const data = await loadJson("news.json");

    const newItem = {
      id: `news_${Date.now()}`,
      title: req.body.title || "",
      body: req.body.body || "",
      created_at: new Date().toISOString(),
      visible_from: req.body.visible_from || null,
      visible_to: req.body.visible_to || null
    };

    data.items.push(newItem);
    await saveJson("news.json", data);

    res.json(newItem);
  } catch (err) {
    next(err);
  }
});

// NEWS AKTUALISIEREN
router.put("/:id", async (req, res, next) => {
  try {
    const data = await loadJson("news.json");

    const index = data.items.findIndex(x => x.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Nicht gefunden" });
    }

    data.items[index] = {
      ...data.items[index],
      ...req.body
    };

    await saveJson("news.json", data);
    res.json(data.items[index]);
  } catch (err) {
    next(err);
  }
});

// NEWS LÖSCHEN
router.delete("/:id", async (req, res, next) => {
  try {
    const data = await loadJson("news.json");
    const before = data.items.length;

    data.items = data.items.filter(x => x.id !== req.params.id);

    if (data.items.length === before) {
      return res.status(404).json({ error: "Nicht gefunden" });
    }

    await saveJson("news.json", data);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
