import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { LeerJsonPorCarpeta } from "../utilidad/LeerJSONPorCarpeta.js";

export const ObtenerTodasLasCategorias = (req, res) => {
  try {
    const filePath = path.resolve(__dirname, "../models/categorias/cat.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las categorías" });
  }
};

export const ObtenerCategoriaPorId = (req, res) => {
  // Obtenemos el JSON si existe
  const data = LeerJsonPorCarpeta("categorias", req.params.id);

  // Si no existe retornamos error 404 (Not found)
  if (!data) {
    return res.status(404).json({ error: "Categoria no encontrada" });
  }

  res.json(data);
};
