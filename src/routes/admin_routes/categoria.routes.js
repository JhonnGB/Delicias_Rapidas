const { Router } = require('express');
const router = Router();

// Importa uploadFields desde app.js
const { uploadFields } = require('../../app');

// Importacion de funciones y controladores
const { renderAdm, renderCrearCategoria, crearCategoria, elimiarCategoria, renderEditarCategoria, editarCategoria } = require('../../controllers/admin_controllers/categoriasAdm')

// importacion de Middleware de autenticacion Login
const { authenticateToken } = require("../../authentication/auth");
// importacion de Middleware de autenticacion SuperUsuario
const { authenticateRole } = require("../../authentication/admAuth");

// Middleware de autenticación para todas las rutas adm (funciona para categorias y productos)
router.use('/adm', authenticateToken, authenticateRole);


router.get('/adm', renderAdm);

router.get('/adm/crear', renderCrearCategoria)

router.post('/adm/crear-categoria', uploadFields, crearCategoria)

router.delete('/adm/eliminar-categoria', elimiarCategoria)

router.get('/adm/editar-categoria', renderEditarCategoria);

router.put('/adm/editar-categoria', uploadFields, editarCategoria)


module.exports = router;