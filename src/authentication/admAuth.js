const User = require("../models/User");
const jwt = require("jsonwebtoken");

async function authenticateRole(req, res, next) {
  try {
    const { userId } = req.user;

    const usuario = await User.findById(userId);
    const roleUsuario = usuario.role;

    if (req.user && roleUsuario === 'superusuario') {
      const adminToken = req.cookies.adminToken;

      if (!adminToken) {
        req.session.returnTo = req.originalUrl;
        console.log('El token de administrador no existe o es inválido');
        req.flash("success", "Ingrese la clave de empresa.");
        return res.render('pages/admin/auth', { successMessage: req.flash('success') });
      }

      jwt.verify(adminToken, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          console.error('Error al verificar el token:', err.message);
          req.flash("errors", 'Sesión Expirada.');

          res.clearCookie("adminToken");

          return res.render('pages/admin/auth', { errorsMessage: req.flash('errors') });
        }

        if (decodedToken.superusuario === true) {
          return next();

        } else {
          console.log('El usuario no es un superusuario');
          req.flash("errors", 'Acceso denegado, usuario no admin.');
          
          res.clearCookie("adminToken");
          res.clearCookie("authToken");
          
          return res.redirect('/login')
        }
      });
    } else {
      res.clearCookie("adminToken");
      console.error('Permiso Admin Denegado');
      req.flash("errors", "Acceso Denegado.");
      res.redirect("/");
    }
  } catch (error) {
    console.error('Error en el servidor', error);
    res.status(500).send('Error en el servidor', error);
  }
}

module.exports = { authenticateRole };