const jwt = require("jsonwebtoken");

// Middleware para verificar la autenticacion de usuario
function authenticateToken(req, res, next) {
  const token = req.cookies.authToken;

  if (!token) {
    req.flash('errors', 'Por favor, inicie sesión para continuar.');

    if (!req.originalUrl.startsWith("/agregar/")) {
      req.session.returnTo = req.originalUrl;
    }
    // req.session.returnTo = req.originalUrl;
    return res.render('pages/users/login', { errorsMessage: req.flash('errors') });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      req.flash('errors', 'Sesión Expirada, por favor inicie sesión.');
      delete req.session.returnTo;
      return res.render('pages/users/login', { errorsMessage: req.flash('errors') });
    }
    
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };