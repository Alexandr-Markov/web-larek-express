import { StringValue } from "ms";
import path from "path";

export const {
  PORT = 3000,
  DB_ADDRESS = "mongodb://127.0.0.1:27017/weblarek",
} = process.env;

export const AUTH_REFRESH_TOKEN_EXPIRY = "7d" as StringValue;
export const TMP_DIR = path.resolve(process.env.TMP_DIR ?? "src/tmp");
export const IMAGES_DIR = path.resolve(
  process.env.IMAGES_DIR ?? "src/public/images",
);
export const CORS_URL = process.env.CORS_URL ?? "http://localhost:5173";
