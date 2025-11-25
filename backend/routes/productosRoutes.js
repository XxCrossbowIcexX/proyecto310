import express from "express";
import { ObtenerProductoPorId } from "../controllers/productosController.js";

const router = express.Router();

router.get("/:id", ObtenerProductoPorId);

export default router;
