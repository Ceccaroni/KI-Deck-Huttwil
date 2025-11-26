import { createClient } from "webdav";
import dotenv from "dotenv";
dotenv.config();

const client = createClient(
  process.env.NEXTCLOUD_BASE_URL,
  {
    username: process.env.NEXTCLOUD_USER,
    password: process.env.NEXTCLOUD_PASSWORD
  }
);

export default client;
