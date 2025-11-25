import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PublicarVenta = (req, res) => {
  try {
    const filePath = path.resolve(__dirname, "../models/ventas/publish.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las categorías" });
  }
};
