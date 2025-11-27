import 'dotenv/config';
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken"; 

import catsRoutes from "./routes/categoriasRoutes.js";
import productsRoutes from "./routes/productosRoutes.js";
import commentsRoutes from "./routes/comentariosRoutes.js";
import ventasRoutes from "./routes/ventasRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); 
app.use("/login", loginRoutes); 
app.use("/ventas", ventasRoutes); 
app.get("/", (req, res) => {
    res.send("¡Backend de eMercado JAP 2025 funcionando correctamente!");
});
app.listen(port, () => console.log(`Servidor iniciado correctamente en http://localhost:${port}`));