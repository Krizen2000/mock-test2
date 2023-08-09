import { config } from "dotenv";
config();

const { MONGODB_URL, PORT } = process.env;
if (!MONGODB_URL || !PORT) {
  throw Error("Environment variables not found!");
}

globalThis.mongodbUrl = MONGODB_URL;
globalThis.port = PORT;
