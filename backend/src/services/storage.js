import client from "./nextcloud.js";
import dotenv from "dotenv";
dotenv.config();

const ROOT = process.env.NEXTCLOUD_ROOT_PATH;

export async function loadJson(filename) {
  try {
    const path = `${ROOT}/${filename}`;
    const raw = await client.getFileContents(path, { format: "text" });
    return JSON.parse(raw);
  } catch (err) {
    // falls Datei fehlt → leere Struktur
    return { items: [] };
  }
}

export async function saveJson(filename, data) {
  const path = `${ROOT}/${filename}`;
  const raw = JSON.stringify(data, null, 2);
  await client.putFileContents(path, raw, { overwrite: true });
}
