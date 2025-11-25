import express from "express";
import {
  ObtenerTodasLasCategorias,
  ObtenerCategoriaPorId,
} from "../controllers/categoriasController.js";

const router = express.Router();

router.get("/", ObtenerTodasLasCategorias);
router.get("/:id", ObtenerCategoriaPorId);

export default router;
