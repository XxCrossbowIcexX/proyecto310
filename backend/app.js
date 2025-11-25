import express from "express";
import cors from "cors";

// Importar Routers
import catsRoutes from "./routes/categoriasRoutes.js";
import productsRoutes from "./routes/productosRoutes.js";
import commentsRoutes from "./routes/comentariosRoutes.js";
import ventasRoutes from "./routes/ventasRoutes.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Ruta raíz
app.get("/", (req, res) => {
  res.send("¡Backend de eMercado JAP 2025 funcionando correctamente!");
});

app.use("/categorias", catsRoutes);
app.use("/productos", productsRoutes);
app.use("/comentarios", commentsRoutes);
app.use("/ventas", ventasRoutes);

app.listen(port, () => console.log("Servidor iniciado correctamente"));
