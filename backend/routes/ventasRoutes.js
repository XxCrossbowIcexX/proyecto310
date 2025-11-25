import express from "express";
import { PublicarVenta } from "../controllers/ventasController.js";

const router = express.Router();

router.get("/publicar", PublicarVenta);

export default router;
