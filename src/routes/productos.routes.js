const { Router } = require("express");
const router = Router();

// Importacion de funciones y controladores
const { filtrarProductos } = require("../controllers/productsFilter");
const { añadirPorducto, guardarProducto } = require("../controllers/añadir.controller");

// importacion de Middleware de autenticacion
const { authenticateToken } = require("../authentication/auth");

// Productos
router.get("/productos/:categoria", filtrarProductos);

// Renderizar vista para añadir producto
router.get("/agregar/:id", authenticateToken, añadirPorducto);

// Añadir producto al carrito de comrpas
router.post("/agregar-producto", authenticateToken, guardarProducto);


module.exports = router;