const express = require("express");
const cors = require("cors");
const port = 3000;

// Genera una instancia de express "Inicializa la aplicación"
const app = express();

// Utilidades
const LeerJsonPorCarpeta = require("./utilidad/LeerJSONPorCarpeta");

// Datos
const listaCategorias = require("./api/categorias/cat.json");
const ventas = require("./api/ventas/publish.json");

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.get("/", (req, res) => {
  res.send("!Backend de eMercado JAP 2025 Funcionando correctamente!");
});

app.get("/categorias", (req, res) => {
  res.json(listaCategorias);
});

app.get("/categorias/:id", (req, res) => {
  // Obtenemos el JSON si existe
  const data = LeerJsonPorCarpeta("categorias", req.params.id);

  // Si no existe retornamos error 404 (Not found)
  if (!data) {
    return res
      .status(404)
      .json({ error: "Producto de la categoría no encontrado" });
  }

  res.json(data);
});

app.get("/productos/:id", (req, res) => {
  // Obtenemos el JSON si existe
  const data = LeerJsonPorCarpeta("productos", req.params.id);

  // Si no existe retornamos error 404 (Not found)
  if (!data) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(data);
});

app.get("/comentarios/:id", (req, res) => {
  // Obtenemos el JSON si existe
  const data = LeerJsonPorCarpeta("comentarios", req.params.id);

  // Si no existe retornamos error 404 (Not found)
  if (!data) {
    return res.status(404).json({ error: "Comentarios no encontrados" });
  }

  res.json(data);
});

app.get("/ventas/publish.json", (req, res) => {
  res.json(ventas);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log("Servidor iniciado correctamente");
});
