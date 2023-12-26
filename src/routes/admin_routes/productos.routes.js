const { Router } = require('express');
const router = Router();

// Importa uploadSingle desde app.js
const { uploadSingle } = require('../../app');

// Importacion de funciones y controladores
const { renderProductosAdm, renderCrearProducto, crearProducto, eliminarProducto, renderEditarProducto, editarProducto } = require('../../controllers/admin_controllers/productosAdm')

router.get('/adm/productos/:nomCatego', renderProductosAdm)

router.get('/adm/productos-todos', renderProductosAdm)

router.get('/adm/crear/producto', renderCrearProducto)

router.post('/adm/crear/producto', uploadSingle, crearProducto)

router.delete('/adm/eliminar-producto', eliminarProducto)

router.get('/adm/editar-producto', renderEditarProducto)

router.put('/adm/editar-producto', uploadSingle, editarProducto)


module.exports = router;