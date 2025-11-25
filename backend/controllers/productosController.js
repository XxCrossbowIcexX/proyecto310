import { LeerJsonPorCarpeta } from "../utilidad/LeerJSONPorCarpeta.js";

export const ObtenerProductoPorId = (req, res) => {
  // Obtenemos el JSON si existe
  const data = LeerJsonPorCarpeta("productos", req.params.id);

  // Si no existe retornamos error 404 (Not found)
  if (!data) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(data);
};
