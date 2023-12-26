const productoEscogido = {};
const { default: mongoose } = require("mongoose");
const Producto = require("../models/Products");
const Carrito = require("../models/Carrito");

productoEscogido.añadirPorducto = async (req, res) => {
  try {
    const id = req.params.id;
    const ObjectId = mongoose.Types.ObjectId;
    let producto = await Producto.findOne({ _id: new ObjectId(id) });
    
    if (producto) {
      res.render("pages/añadir-producto", { producto } );
    } else {
      console.error("producto no encontrado");
      res.status(404).send("Producto no encontrado");
    }
  } catch (error) {
    console.error("Error en el servidor", error);
    res.status(500).send("Error en el servidor", error);
  }
};

productoEscogido.guardarProducto = async (req, res) => {
  const returnTo = req.session.returnTo || "/";
  
  // verificación de usuario autenticado
  if (!req.user) {
    req.flash("errors", "Por favor, inicie sesión para continuar.");
    res.clearCookie("authToken");
    return res.redirect("/login");
  };

  // obtencion de datos
  const { productoId, cantidad } = req.body;
  parseInt(cantidad, 10);

  // verificacion de datos
  if (!productoId || !cantidad || isNaN(cantidad)) {
    req.flash('errors', 'Datos de producto inválidos.');
    console.error('Datos de producto inválidos.')
    return res.redirect(returnTo);
  };

  try {
    const userId = req.user.userId;
    const pedidoExistente = await Carrito.findOne({ productoId: productoId, userId: userId });
    
    if (!pedidoExistente) {
      const newCarrito = new Carrito({
        userId: userId,
        productoId: productoId,
        cantidadProducto: cantidad,
      });

      await newCarrito.save();
      console.log("Producto añadido al carrito.");
      req.flash("success", "Producto añadido al carrito.");

    } else {
      pedidoExistente.cantidadProducto += parseInt(cantidad);
      await pedidoExistente.save();
      console.log("Cantidad actualizada en el carrito");
      req.flash("success", "Pedido Actualizado.");
    }
  } catch (error) {
    console.error("Error en el servidor al guardar el producto: ", error);
    req.flash("errors", "Error en el servidor al guardar el producto: ");
  }
  res.redirect(returnTo);
};


module.exports = productoEscogido;