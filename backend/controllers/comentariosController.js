import { LeerJsonPorCarpeta } from "../utilidad/LeerJSONPorCarpeta.js";

export const ObtenerComentariosPorId = (req, res) => {
  // Obtenemos el JSON si existe
  const data = LeerJsonPorCarpeta("comentarios", req.params.id);

  // Si no existe retornamos error 404 (Not found)
  if (!data) {
    return res.status(404).json({ error: "Comentarios no encontrados" });
  }

  res.json(data);
};
