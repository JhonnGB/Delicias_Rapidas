require("dotenv").config();
const express = require("express");
const multer = require('multer');
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const flash = require('connect-flash');
const morgan = require("morgan");

// Inicializacion de Express
const app = express();
const port = process.env.PORT || 3000;

// Conexión a Base de Datos
require("./database");

//  Configuración de multer para la gestión de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) { 
    const destinationFolder = path.join(__dirname, 'public/imgs/'); 
    cb(null, destinationFolder);
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Configuración para manejar 'cover' e 'icono'
const uploadFields = multer({ 
  storage: storage,
  limits: {
    // 5 MB
    fileSize: 1024 * 1024 * 5, 
  }, 
}).fields([{ name: 'cover' }, { name: 'icono' }]);

// Configuración para manejar 'img'
const uploadSingle = multer({ 
  storage: storage,
  limits: {
    // 5 MB
    fileSize: 1024 * 1024 * 5,
  }, 
}).single('img');

// Exportacion de configuraciones
module.exports = { 
  uploadFields: uploadFields, 
  uploadSingle: uploadSingle, 
  destinationFolder: path.join(__dirname, 'public/imgs/') 
};

// Configuracion de express-session
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Configuración de connect-flash
app.use(flash());


// Middleware para configurar mensajes
app.use((req, res, next) => {
  res.locals.successMessage = [];
  res.locals.errorsMessage = [];
  res.locals.errorsText = [];
  next();
});

// Otros Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

// configuracion de Morgan
app.use(
  morgan(":method :url :status :response-time ms -", {
    skip: (req, res) => {
      return (
        req.url.startsWith("/icons/") ||
        req.url.startsWith("/img/") ||
        req.url.startsWith("/imgs/") ||
        req.url.startsWith("/css/") ||
        req.url.startsWith("/js/")
      );
    },
  })
);

// Varibles Globales
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  // res.locals.admin = req.admin || null;
  // user = req.user || null,
  token = req.cookies.authToken;
  adminToken = req.cookies.adminToken || null;
  next();
});

// Motor de plantilla EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname + "/views"));

// Archivos estaticos
app.use(express.static(__dirname + "/public"));

// Routes
app.use(require("./routes/index.routes"));
app.use(require("./routes/empresa.routes"));
app.use(require("./routes/productos.routes"));
app.use(require("./routes/user.routes"));
app.use(require("./routes/carrito.routes"));
app.use(require("./routes/pago.routes"));

// Routes Admin
app.use(require("./routes/admin_routes/categoria.routes"));
app.use(require("./routes/admin_routes/productos.routes"));
app.use(require("./routes/admin_routes/authAdm.routes"));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ${port} en funcionamiento.`);
});