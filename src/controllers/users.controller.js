const usersCtrl = {};
const jwt = require("jsonwebtoken");
const User = require("../models/User");

usersCtrl.renderRegisterForm = (req, res) => {
  res.render("pages/users/register");
};

// funcion para validar contrasañas
function validarContraseña(password, confirm_password) {
  const errores = [];

  // uso de RegExp (expresiones regulares) para validar contraseña
  const numberRegex = /\d/;
  const uppercaseRegex = /[A-Z]/;
  const spaceRegex = /\s/;

  if (password.length < 8) { errores.push("La contraseña debe tener al menos 8 caracteres."); }
  if (!numberRegex.test(password)) { errores.push("La contraseña debe contener al menos un número."); }
  if (!uppercaseRegex.test(password)) { errores.push("La contraseña debe contener al menos una letra mayúscula."); }
  if (spaceRegex.test(password)) { errores.push("La contraseña no puede contener espacios."); }
  if (password !== confirm_password) { errores.push("Las contraseñas ingresadas no coinciden."); }

  return errores;
}

usersCtrl.register = async (req, res) => {
  const { name, lastName, cel, birthdate, email, password, confirm_password } = req.body;
  
  try {
    // Verificar si el correo ya está registrado
    const emailUser = await User.findOne({ email: email });

    if (emailUser) {
      req.flash("errText", "El correo ya se encuntra registrado.");
      res.render("pages/users/register", {
        errorsText: req.flash("errText"),
        name,
        lastName,
        cel,
        birthdate,
      });
      return;
    }

    const erroresContraseña = validarContraseña(password, confirm_password);

    if (erroresContraseña.length > 0) {
      // Mostrar mensajes de error al usuario
      res.render("pages/users/register", {
        errorsText: erroresContraseña,
        name,
        lastName,
        cel,
        birthdate,
        email,
      });
      return;
    }

    // crear nuevo usuario
    const newUser = new User({
      name,
      lastName,
      cel,
      birthdate,
      email,
      password,
    }); 

    // Encriptar la contraseña antes de guardarla
    newUser.password = await newUser.encrypPassword(password);

    // guardar el nuevo usaurio en la BD
    await newUser.save();
    
    req.flash("success", "Su Registro Fue Exitoso.");
    res.render("pages/users/login", {
      successMessage: req.flash("success"),
    });

  } catch (error) {
    console.error("Hubo un error durante el registro", error);
    res.status(404).send("Hubo un error durante el registro", error);
  }
};

usersCtrl.renderLoginForm = (req, res) => {
  // se obtiene los mensajes errors
  const errorsMessage = req.flash("errors");
  // se renderiza el fromulario de login
  res.render("pages/users/login", { errorsMessage });
};

usersCtrl.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      req.flash("errText", "Correo o contraseña incorrecta.");
      return res.render("pages/users/login", { errorsText: req.flash("errText") });
    }

    // Genera un token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role, },
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    req.flash("success", "Inicio de Sesión exitoso.");

    // Se almacena el token en una cookie
    res.cookie("authToken", token);

    // Se redirige al usuario a la página previa o a la página de inicio
    const returnTo = req.session.returnTo || "/";
    res.redirect(returnTo);

  } catch (error) {
    console.error("Error durante el inicio de sesión:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

usersCtrl.logout = (req, res) => {
  res.clearCookie("adminToken");
  res.clearCookie("authToken");
  // redirección a inicio 
  res.redirect("/");
};


module.exports = usersCtrl;