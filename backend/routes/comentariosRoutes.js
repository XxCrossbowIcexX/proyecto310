import express from "express";
import { ObtenerComentariosPorId } from "../controllers/comentariosController.js";

const router = express.Router();

router.get("/:id", ObtenerComentariosPorId);

export default router;
