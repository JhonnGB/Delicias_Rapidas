const jwt = require("jsonwebtoken");

const clave = process.env.SECRET_KEY_COMPANY;

const authAdminController = async (req, res) => {
  try {
    const { companyKey } = req.body;

    if (companyKey === clave) {
      const token = req.cookies.authToken;

      try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (decodedToken && decodedToken.userId) {
          decodedToken.superusuario = true;
          const nuevoToken = jwt.sign(decodedToken, process.env.JWT_SECRET);

          await res.cookie("adminToken", nuevoToken);

          req.flash("success", "Zona de administración.");
          
          const returnTo = req.session.returnTo || "/";
          return res.redirect(returnTo);
        } else {
          console.log('No se pudo decodificar el token existente');
          return res.status(401).send('No se pudo decodificar el token existente');
        }
      } catch (error) {
        console.error('Error al verificar el token:', error.message);
        return res.status(401).send('Error al verificar el token');
      }
    } else {
      console.log("Acceso Denegado: Clave de empresa incorrecta");
      req.flash("errors", "Denegado: clave de empresa incorrecta.");
      return res.redirect('/')
    }
  } catch (error) {
    console.error("Error", error);
    return res.status(500).send(`Error en el servidor: ${error.message}`);
  }
};

module.exports = { authAdminController };