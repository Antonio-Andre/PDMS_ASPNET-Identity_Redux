import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourcePath = path.join(__dirname, "../src/data/FeedData.json");
const filepath = path.join(__dirname, "../src/data/MockDataBase.json");

try {
  const data = fs.readFileSync(sourcePath, "utf8");
  fs.writeFileSync(filepath, data);

  console.log("MockDataBase created sucessfully (MockDataBase.json).");
} catch (err) {
  console.error(" Error creating MockDataBaseb.json:", err.message);
}
