import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

import catsRoutes from "./routes/categoriasRoutes.js";
import productsRoutes from "./routes/productosRoutes.js";
import commentsRoutes from "./routes/comentariosRoutes.js";
import ventasRoutes from "./routes/ventasRoutes.js";

const app = express();
const port = 3000;
const JWT_SECRET = 'Clave_Secreta_Compartida_eMercado'; 

app.use(cors());
app.use(express.json());

// Generación del Token
app.post('/login', (req, res) => {
    const { usuario, contraseña } = req.body; 

    // Validación y Verificación de Credenciales
    if (usuario === 'admin' && contraseña === 'jap2025') {
        const user = { id: 1, name: usuario };
        const token = jwt.sign(
            user, 
            JWT_SECRET, 
            { expiresIn: '1h' } 
        );

        // Devuelve el token
        return res.json({ 
            mensaje: 'Autenticación exitosa', 
            token: token 
        });

    } else {
        // Login Fallido
        return res.status(401).json({ 
            mensaje: 'Usuario o contraseña incorrectos. Acceso denegado.' 
        });
    }
});
// -----------------------------


// Ruta raíz
app.get("/", (req, res) => {
    res.send("¡Backend de eMercado JAP 2025 funcionando correctamente!");
});

app.use("/categorias", catsRoutes);
app.use("/productos", productsRoutes);
app.use("/comentarios", commentsRoutes);
app.use("/ventas", ventasRoutes);

app.listen(port, () => console.log(`Servidor iniciado correctamente en http://localhost:${port}`));
