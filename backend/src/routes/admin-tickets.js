import express from "express";
import client from "../services/nextcloud.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const folder = `${process.env.NEXTCLOUD_ROOT_PATH}/tickets/`;
    const listing = await client.getDirectoryContents(folder);
    const files = listing.filter(x => x.type === "file");

    const tickets = [];
    for (const file of files) {
      const raw = await client.getFileContents(file.filename, { format: "text" });
      tickets.push(JSON.parse(raw));
    }

    tickets.sort((a, b) => b.created_at.localeCompare(a.created_at));
    res.json(tickets);
  } catch (err) {
    next(err);
  }
});

export default router;
