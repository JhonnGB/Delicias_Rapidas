const { Router } = require("express");
const router = Router();

// Importacion de funciones y controladores
const { findCategories } = require("../controllers/categoryControllers");

// Pagina principal
router.get("/", findCategories);

module.exports = router;