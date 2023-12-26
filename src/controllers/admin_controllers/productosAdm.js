const admControllers = {};
const mongoose = require('mongoose');
const Producto = require("../../models/Products");
const Category = require("../../models/Category")
const fs = require('fs');
const path = require('path');
const { destinationFolder } = require('../../app')

admControllers.renderProductosAdm = async (req, res) => {
  try {
    const categoria = req.params.nomCatego;
    const currentUrl = req.url;
    var productos = [];
    var allProducts = false;

    if (currentUrl == "/adm/productos-todos") {
      productos = await Producto.find();
      allProducts = true;
    } else if (categoria) {
      productos = await Producto.find({ categoria: categoria });
    } else {
      return res.status(400).send('Error, ruta inválida o indefinida')
    }

    const successMessage = req.flash("success") 
    const errorsMessage = req.flash("errors");

    req.session.returnTo = req.originalUrl;
    res.render("pages/admin/productosAdm", { productos, categoria, allProducts, successMessage, errorsMessage });
  } catch (error) {
    console.log("Error interno del servidor", error);
    res.status(500).send(`Error interno del servidor: ${error.message}`);
  }
};

admControllers.renderCrearProducto = async (req, res) => {
  // se obtiene el nombre de la categoria a la cual pertenecera el producto
  const categoria = req.query.dataCategoria;

  // verificacion existencia de "categoria" (no importa si es [])
  if (!categoria && !categoria == 'undefined') {
    return res.status(400).send('La categoría no ha sido especificada para crear el producto')
  }

  res.render("pages/admin/crearProducto", { categoria });
};

admControllers.crearProducto = async (req, res) => {
  const { categoria, nombre, descripcion, precio } = req.body;

  // validar existencia de categoria
  const verificarCat = await Category.findOne({nomCatego: categoria})
  if (!verificarCat) {
    return res.status(400).send('Error. La categoría especificada no existe')
  }

  // pasar precio de string a number
  parseInt(precio, 10);

  // verificacion de datos
  if (!nombre || !descripcion || !precio || !req.file) {
    console.log('Datos incompletos para la creacion del producto')
    return res.status(400).send(`Datos incompletos para la creacion del producto`);
  } else if (isNaN(precio)) {
    return res.status(400).send(`el campo "precio" debe ser un numero`);
  }

  const img = req.file;

  try {
    // creacion de nuevo documento (producto)
    const nuevoProducto = new Producto({
      categoria,
      nombre,
      descripcion,
      precio,
      img: img.filename,
    });

    // se guarda el documento creado
    const successSave = await nuevoProducto.save();
 
    if (successSave) {
      console.log("Producto Creado Exitosamente.", nuevoProducto);
      req.flash("success", "Produto creado con éxito.")

      // Se incremente en 1 el numero de productos de la categoria correspondiente;
      verificarCat.numProducts++;
      await verificarCat.save();
    } else {
      return res.status(404).send('Error interno al guardar el producto en la base de datos')
    }

    const returnTo = req.session.returnTo || "/";
    res.redirect(returnTo);

  } catch (error) {
    console.error("Error al crear el producto:", error);
    return res.status(500).send(`Error interno del servidor: ${error.message}`);
  }
};

admControllers.eliminarProducto = async (req, res) => {
  try {
    const recursoId = req.body.recursoId;

    // se obtiene la ruta de la carpeta que contiene los archivos img
    const rutaCarpeta = destinationFolder;

    // Verificar si el documento (el producto) existe
    const productoToDelete = await Producto.findById(recursoId);
    if (!productoToDelete) {
      return res.status(404).json({ error: "El producto no existe" });
    }

    // Se elimina el documento (el producto)
    const deletedProduct = await Producto.findByIdAndDelete(recursoId);

    // Se extrae el nombre de archivo img
    var nombreImg = productoToDelete.img

    if (deletedProduct) {
      // Se elimina el archivo de imagen del producto
      eliminarImagen(rutaCarpeta, nombreImg)

      // se obtiene la categoria correspondiente al producto eliminado
      const catCorrespon = await Category.findOne({ nomCatego: productoToDelete.categoria })
      // se disminuye en 1 el numero de productos de la categoria
      catCorrespon.numProducts--;
      await catCorrespon.save();
      
      console.log("Producto eliminado con éxito:", deletedProduct);
      req.flash("success", "Producto eliminado con éxito.")
      
      // Se obtiene la ruta de la pagina anterior
      const returnTo = req.session.returnTo || "/";
      // Se redirige a la pagina anterior
      res.redirect(returnTo);
    } else {
      return res.status(404).json({ error: "Error al eliminar el producto" });
    }
  } catch (error) {
    console.error("Error del servidor al eliminar el producto", error);
    res.status(500).send(`Error del servidor al eliminar el producto: ${error.message}`);
  }
};

admControllers.renderEditarProducto = async (req, res) => {
  try {
    const recursoId = req.query.recursoId;
    // validar el Id proporcionado
    if (!recursoId || !mongoose.isValidObjectId(recursoId)) {
      return res.status(400).send("ID de Producto inválido");
    }

    const datosProducto = await Producto.findById(recursoId)
    // valida si existe el producto
    if (!datosProducto) {
      return res.status(404).send("Error, producto no encontrado")
    }

    // const returnTo = req.session.returnTo || "/";
    res.render('pages/admin/editarProducto', { datosProducto })

  } catch (error) {
    console.log("Error en el servidor", error)
    res.status(500).send(`Error en el servido: ${error.message}`)
  }
}

admControllers.editarProducto = async (req, res) => {
  const returnTo = req.session.returnTo || "/";
  
  try {
    const { productoId, nombre, descripcion, precio  } = req.body;    

    parseInt(precio, 10);

    // verificacion de datos
    if (!nombre && !descripcion && !precio && !req.file) {
      console.log('Ningun dato por actualizar')
      return res.redirect(returnTo);
    } else if (isNaN(precio)) {
      return res.status(400).send(`el campo "precio" debe ser un numero`);
    }

    const productoToUpdate = await Producto.findById( productoId )
    // verificar existencia de producto
    if (!productoToUpdate) {
      return res.status(500).send('Error, no se encontro el producto a actualizar')
    };

    // se obtiene la ruta de la carpeta que contiene los archivos img
    const rutaCarpeta = destinationFolder

    // inicialización de variable
    let imgArchivo;

    if (req.file) {
      // se obtienen los datos del nuevo archivo
      imgArchivo = req.file;
 
      // se obtiene el nombre del archivo img antiguo
      var nombreImagen = productoToUpdate.img

      // se elimina el archivo antiguo
      eliminarImagen(rutaCarpeta, nombreImagen)
    }
    
    // Actualiza las propiedades de productoToUpdate solo si no están vacías
    productoToUpdate.nombre = nombre || productoToUpdate.nombre;
    productoToUpdate.descripcion = descripcion || productoToUpdate.descripcion;
    productoToUpdate.precio = precio || productoToUpdate.precio;
    productoToUpdate.img = (imgArchivo && imgArchivo.filename) || productoToUpdate.img;

    // se guarda los cambios
    await productoToUpdate.save();
    console.log('Producto Actualizado con éxito', productoToUpdate)
    req.flash("success", "Producto actualizado con éxito.")

    res.redirect(returnTo);
    
  } catch (error) {
    console.log('Error en el servidor al actualizar el producto', error)
    res.status(500).send(`Error en el servido al editar el producto: ${error.message}`)
  }
}

function eliminarImagen(rutaCarpeta, nombreImagen) {
  try {
    // Se construye la ruta completa al archivo
    const rutaCompleta = path.join(rutaCarpeta, nombreImagen);

    // Verificar si la imagen existe
    if (fs.existsSync(rutaCompleta)) {
      // Eliminar la imagen
      fs.unlinkSync(rutaCompleta);
      console.log(`Imagen eliminada: ${rutaCompleta}`);
      
    } else {
      console.log('El archivo antiguio no existe', rutaCompleta)
    }
  } catch (error) {
    console.error(`Error al eliminar la imagen: ${error}`);
  }
}


module.exports = admControllers;