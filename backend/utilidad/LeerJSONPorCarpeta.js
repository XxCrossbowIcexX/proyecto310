import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const LeerJsonPorCarpeta = (carpeta, id) => {
  const filePath = path.join(__dirname, "..", "models", carpeta, `${id}.json`);
  console.log(filePath);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return data;
};
