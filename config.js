const path = require("path");

const PORT = 3000;
const STATIC_DIR = path.join(__dirname, "public");
const UPLOADS_DIR = path.join(STATIC_DIR, "images");

const MONGO_URL = "mongodb://127.0.0.1:27017";
const STORE_MOD = "database";
const STORE_MOD_DIR = path.join(__dirname, STORE_MOD);

module.exports = {
  PORT,
  STATIC_DIR,
  UPLOADS_DIR,
  STORE_MOD_DIR,
  MONGO_URL
};
