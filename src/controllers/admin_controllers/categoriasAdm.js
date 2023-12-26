const admControllers = {};
const mongoose = require('mongoose');
const Category = require("../../models/Category");
const fs = require('fs');
const path = require('path');
const { destinationFolder } = require('../../app');


admControllers.renderAdm = async (req, res) => {
  try {
    const categorias = await Category.find();

    const successMessage = req.flash("success") 
    const errorsMessage = req.flash("errors");
    
    res.render("pages/admin/inicioAdm", { categorias, successMessage, errorsMessage });
  } catch (error) {
    console.log('Error', error)
    res.status(500).send(`Error en el servidor: ${error.message}`);
  }
};

admControllers.renderCrearCategoria = async (req, res) => {
  res.render("pages/admin/crearCategoria");
};

admControllers.crearCategoria = async (req, res) => {
    const { nomCatego } = req.body

    // verificacion de datos
    if (!nomCatego) {
      return res.status(400).json({ error: "Nombre de categoria invalido" });
    }

    // verificacion de archivos (cover, icono)
    if (!req.files || !req.files['cover'] || !req.files['icono']) {
      return res.status(400).json({ error: "La imagen y el icono no están siendo cargados" });
    }

    const coverArchivo = req.files['cover'][0]; 
    const iconoArchivo = req.files['icono'][0];

    try {
      // creacion de nuevo documento (categoria)
      const nuevaCategoria = new Category({
        nomCatego,
        numProducts: 0,
        cover: coverArchivo.filename,
        icono: iconoArchivo.filename,
      })

      // se guarda el documento creado
      await nuevaCategoria.save();
      console.log('Categoria Creada Exitosamente.');

      req.flash("success", "Categoría creada con éxito.")

      res.redirect('/adm');

    } catch (error) {
        console.error("Error al crear la categoría:", error);
        return res.status(500).send(`Error en el servidor: ${error.message}`);
    }
};

admControllers.elimiarCategoria = async (req, res) => {
  try {
    const recursoId = req.body.recursoId;
    
    // se obtiene la ruta de la carpeta que contiene los archivos img
    const rutaCarpeta = destinationFolder;
    
    // Verificar si el documento (categoria) existe
    const categoriaToDelete = await Category.findById(recursoId);
    if (!categoriaToDelete) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    // Se elimina el documento (la categoria)
    const deletedCategory = await Category.findByIdAndDelete(recursoId);

    // Se extrae nombres de archivos
    var nombreCover = categoriaToDelete.cover
    var nombreIcono = categoriaToDelete.icono

    if (deletedCategory) {
      // Se eliminan los archivos de imagen e icono de la categoria
      eliminarImagen(rutaCarpeta, nombreCover)
      eliminarImagen(rutaCarpeta, nombreIcono)

      console.log('Categoría eliminada con éxito:', deletedCategory);
      req.flash("success", "Categoría eliminada con éxito.")

      res.redirect('/adm');
    } else {
      return res.status(404).json({ error: "Error al eliminar la categoría" });
    }
  } catch (error) {
      console.error('Error del servidor al eliminar la categoría', error);
      res.status(500).send(`Error en el servidor: ${error.message}`);
    }
};

admControllers.renderEditarCategoria = async (req, res) => {
  try {
    const recursoId = req.query.recursoId;
    // validar el Id proporcionado
    if (!recursoId || !mongoose.isValidObjectId(recursoId)) {
      return res.status(400).send("ID de categoría inválido");
    }

    const datosCategoria = await Category.findById(recursoId)
    // validar existencia de categoria
    if (!datosCategoria) {
      return res.status(404).send("Error, categoría no encontrada")
    }

    res.render("pages/admin/editarCategoria", { datosCategoria });

  } catch (error) {
    console.log("Error en el servidor", error)
    res.status(500).send(`Error en el servido: ${error.message}`)
  }
};

admControllers.editarCategoria = async (req, res) => {
  try {
    const { categoriaId, nomCatego, numProducts } = req.body;

    parseInt(numProducts, 10);

    // validacion de datos
    if (!nomCatego && !numProducts && !req.files['cover'] && !req.files['icono']) {
      console.log('Ningun dato por actualizar.')
      return res.redirect('/adm')
    } else if (isNaN(numProducts)) {
      console.error('El nuemero de productos debe ser un valor numerico.')
      res.status(400).send('"nuemero de productos" debe ser un valor numerico.')
      return res.redirect('/adm')
    };

    const categoriaToUpdate = await Category.findById( categoriaId )

    // validar existencia de categoria
    if (!categoriaToUpdate) {
      return res.status(404).send('Error, categoría no encontrada')
    };

    // se obtiene la ruta de la carpeta que contiene los archivos img
    const rutaCarpeta = destinationFolder

    // inicialización de variables
    let coverArchivo, iconoArchivo;

    if (req.files['cover']) {
      // se obtienen los datos del nuevo archivo
      coverArchivo = req.files['cover'][0];

      // se obtiene el nombre del archivo img antiguo
      var nombreImagen = categoriaToUpdate.cover
      
      // se elimina el archivo antiguo
      eliminarImagen(rutaCarpeta, nombreImagen)
    }

    if (req.files['icono']) {
      // se obtienen los datos del nuevo archivo
      iconoArchivo = req.files['icono'][0];

      // se obtiene el nombre del archivo img antiguo
      var nombreImagen = categoriaToUpdate.icono
      
      // se elimina el archivo antiguo
      eliminarImagen(rutaCarpeta, nombreImagen)
    }
    
    // se actualiza las propiedades de categoriaToUpdate solo si no están vacías
    categoriaToUpdate.nomCatego = nomCatego || categoriaToUpdate.nomCatego;
    categoriaToUpdate.numProducts = numProducts || categoriaToUpdate.numProducts;
    categoriaToUpdate.cover = (coverArchivo && coverArchivo.filename) || categoriaToUpdate.cover;
    categoriaToUpdate.icono = (iconoArchivo && iconoArchivo.filename) || categoriaToUpdate.icono;

    // se guarda los cambios
    await categoriaToUpdate.save();
    console.log('Categoría Actualizada Exitosamente', categoriaToUpdate)
    req.flash("success", "Categoría actualizada con éxito.")

    res.redirect('/adm')
    
  } catch (error) {
    console.log('Error en el servidor al editar la categoría', error)
    res.status(500).send(`Error en el servido al editar la categoría: ${error.message}`)
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