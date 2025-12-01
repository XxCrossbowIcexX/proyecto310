import 'dotenv/config';
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken"; 

import catsRoutes from "./routes/categoriasRoutes.js";
import productsRoutes from "./routes/productosRoutes.js";
import commentsRoutes from "./routes/comentariosRoutes.js";
import ventasRoutes from "./routes/ventasRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";

const verificarToken = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({ error: "Token no proporcionado" });
    }

    const token = header.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Formato de token inválido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: "Token inválido o expirado" });
    }
};

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); 
app.use("/login", loginRoutes); 
app.use("/categorias", verificarToken, catsRoutes);
app.use("/productos", verificarToken, productsRoutes);
app.use("/comentarios", verificarToken, commentsRoutes);
app.use("/ventas", verificarToken, ventasRoutes);

app.get("/", (req, res) => {
    res.send("¡Backend de eMercado JAP 2025 funcionando correctamente!");
});

app.listen(port, () => console.log(`Servidor iniciado correctamente en http://localhost:${port}`));

