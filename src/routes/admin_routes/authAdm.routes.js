const { Router } = require('express');
const router = Router();

// Importacion de funciones y controladores
const { authAdminController } = require('../../controllers/admin_controllers/authAdm')

router.post('/auth/admin', authAdminController);

module.exports = router;